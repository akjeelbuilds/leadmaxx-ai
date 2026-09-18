// Real-browser verification. jsdom could not catch the invisible-bubble bug
// because it does not do layout or paint. This does.
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const SITE = path.join(__dirname, "..", "public", "index.html");
const SHOTS = path.join(__dirname, "..", "shots");

// Serve the site ourselves so the suite is self-contained: no dev server needed.
// Override with BASE_URL to test against a real deployment instead.
function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const file = path.join(__dirname, "..", "public", req.url === "/" ? "index.html" : req.url.split("?")[0]);
      fs.readFile(file, (err, buf) => {
        if (err) { res.writeHead(404); res.end("not found"); return; }
        res.writeHead(200, { "Content-Type": file.endsWith(".html") ? "text/html" : "application/octet-stream" });
        res.end(buf);
      });
    });
    server.listen(0, "127.0.0.1", () => resolve({ server, port: server.address().port }));
  });
}

(async () => {
  const external = process.env.BASE_URL;
  let handle = null, BASE = external;
  if (!external) {
    handle = await serve();
    BASE = `http://127.0.0.1:${handle.port}/`;
    console.log(`\n(serving ${SITE} on ${BASE})`);
  } else {
    console.log(`\n(testing against ${BASE})`);
  }
  fs.mkdirSync(SHOTS, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });

  await page.goto(BASE, { waitUntil: "load" });
  await page.waitForTimeout(2600); // let hero animations finish

  let pass = 0, fail = 0;
  const check = (name, ok, detail) => {
    if (ok) { pass++; console.log(`  PASS  ${name}`); }
    else { fail++; console.log(`  FAIL  ${name}${detail ? "  -> " + detail : ""}`); }
  };

  // effective opacity, accounting for the animation's final state
  const opacityOf = (sel) => page.$eval(sel, (el) => {
    const s = getComputedStyle(el);
    return Math.max(parseFloat(s.opacity), 0);
  });

  console.log("\n===== HERO PHONE =====");
  check("hero sys timestamp visible", (await opacityOf("#heroChat .msg--sys")) > 0.9,
    String(await opacityOf("#heroChat .msg--sys")));
  check("hero customer bubble visible", (await opacityOf("#heroChat .msg--in")) > 0.9);
  check("hero auto reply bubble visible", (await opacityOf("#heroChat .msg--out")) > 0.9);
  check("hero owner alert visible on your phone", (await opacityOf("#heroAlert")) > 0.9,
    String(await opacityOf("#heroAlert")));
  check("hero shows two phones side by side",
    (await page.$$(".hero .duo .phone")).length === 2,
    String((await page.$$(".hero .duo .phone")).length));

  console.log("\n===== DEMO: BEFORE CLICK =====");
  check("demo placeholder hint visible", (await opacityOf("#demoChat .msg--sys")) > 0.9);

  console.log("\n===== DEMO: AFTER SENDING TEST ENQUIRY =====");
  await page.click("#demoRun");

  await page.waitForTimeout(700);
  const midCount = await page.$$eval("#demoChat .msg", (els) => els.length);
  check("customer bubble added right away", midCount >= 2, midCount + " bubbles");
  check("customer bubble actually visible", (await opacityOf("#demoChat .msg--in")) > 0.9,
    String(await opacityOf("#demoChat .msg--in")));

  await page.waitForTimeout(1600); // reply lands at 1750ms
  check("reply bubble rendered", await page.$("#demoChat .msg--out") !== null);
  check("reply bubble VISIBLE", (await opacityOf("#demoChat .msg--out")) > 0.9,
    String(await opacityOf("#demoChat .msg--out")));
  const pdfVisible = await page.$eval("#demoChat .doc", (el) => {
    const r = el.getBoundingClientRect();
    return r.width > 40 && r.height > 20;
  });
  check("PDF card has real painted size", pdfVisible);

  await page.waitForTimeout(1500); // alert lands at 2400ms
  check("owner alert rendered on your phone", await page.$("#demoNotify .alert") !== null);
  check("owner alert VISIBLE", (await opacityOf("#demoNotify .alert")) > 0.9,
    String(await opacityOf("#demoNotify .alert")));

  const bubbleCount = await page.$$eval("#demoChat .msg, #demoNotify .alert", (els) => els.length);
  check("all 4 elements in the chat", bubbleCount === 4, bubbleCount + " elements");

  // every bubble must be both class-marked and actually painted
  const allVisible = await page.$$eval("#demoChat .msg, #demoNotify .alert", (els) =>
    els.map((el) => ({ cls: el.className, op: parseFloat(getComputedStyle(el).opacity) })));
  check("every element has non-zero computed opacity",
    allVisible.every((e) => e.op > 0.9),
    JSON.stringify(allVisible.filter((e) => e.op <= 0.9)));
  check("timers settled at 1.8s", (await page.textContent("#timerVal")) === "1.8s",
    await page.textContent("#timerVal"));

  // The panel used to look unbalanced: the browser mock ran on well below the phones.
  console.log("\n===== DEMO PANEL ALIGNMENT =====");
  const colAlign = await page.evaluate(() => {
    const l = document.querySelector("#demo .demo__site").getBoundingClientRect();
    const r = document.querySelector("#demo .demo__out").getBoundingClientRect();
    const t = document.querySelector("#demo .demo__site .demo__step").getBoundingClientRect();
    const tr = document.querySelector("#demo .demo__out .demo__step").getBoundingClientRect();
    return { lTop: Math.round(t.top), rTop: Math.round(tr.top),
             lBottom: Math.round(l.bottom), rBottom: Math.round(r.bottom) };
  });
  check("both columns start on the same line",
    Math.abs(colAlign.lTop - colAlign.rTop) <= 2, JSON.stringify(colAlign));
  check("both columns end on the same line",
    Math.abs(colAlign.lBottom - colAlign.rBottom) <= 2, JSON.stringify(colAlign));

  console.log("\n===== OTHER INDUSTRIES =====");
  await page.click('#industryPills .pill[data-ind="Solar"]');
  await page.waitForTimeout(2800);
  const solarVisible = await opacityOf("#demoChat .msg--out");
  check("industry switch re-renders visibly", solarVisible > 0.9, String(solarVisible));
  check("solar PDF shown",
    /Rooftop Solar/.test(await page.textContent("#demoChat")),
    (await page.textContent("#demoChat")).slice(-70));

  console.log("\n===== CALCULATOR =====");
  const rev = await page.textContent("#rRev");
  check("calculator output rendered", /13L/.test(rev), rev);

  console.log("\n===== PAYMENT FLOW (mocked, no real charge or sheet write) =====");
  {
    // Intercept the Apps Script POST so the test never writes a row to the real sheet,
    // and stub Razorpay checkout.js so nothing can be charged.
    let sheetPosts = 0;
    await page.route("**/script.google.com/**", (route) => {
      sheetPosts++;
      return route.fulfill({ status: 200, body: "ok" });
    });
    await page.route("**/checkout.razorpay.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `window.Razorpay = function (opts) {
                 window.__rzp = opts;
                 this.open = function () { window.__rzpOpened = true; };
                 this.on = function () {};
               };`,
      })
    );

    await page.evaluate(() => { window.open = () => { window.__waOpened = true; return null; }; });

    await page.click('a[href="#book"]');
    await page.fill("#fName", "Test User");
    await page.fill("#fPhone", "9876543210");
    await page.locator("#bookingForm").evaluate((f) =>
      f.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));

    await page.waitForTimeout(900);
    check("booking POSTed to the sheet endpoint once", sheetPosts === 1, String(sheetPosts));
    check("payment step revealed", await page.isVisible("#payBox"));
    check("WhatsApp fallback did NOT trigger (key is configured)",
      !(await page.evaluate(() => window.__waOpened)));

    await page.click("#payBtn");
    await page.waitForTimeout(1200);

    const rzp = await page.evaluate(() => window.__rzp || null);
    check("Razorpay checkout was constructed", !!rzp);
    if (rzp) {
      check("amount is 39900 paise (Rs 399)", rzp.amount === 39900, String(rzp.amount));
      check("currency is INR", rzp.currency === "INR", String(rzp.currency));
      check("live key passed through", /^rzp_live_/.test(rzp.key || ""), String(rzp.key));
      check("description says consultation call", /consultation call/i.test(rzp.description || ""),
        String(rzp.description));
      check("customer name prefilled from the form", rzp.prefill && rzp.prefill.name === "Test User",
        JSON.stringify(rzp.prefill));
      check("phone prefilled from the form", rzp.prefill && /9876543210/.test(rzp.prefill.contact || ""),
        JSON.stringify(rzp.prefill));
    }
    check("checkout was actually opened", await page.evaluate(() => !!window.__rzpOpened));

    await page.unroute("**/script.google.com/**");
    await page.unroute("**/checkout.razorpay.com/**");
  }

  console.log("\n===== FULL PAGE SCREENSHOTS =====");
  await page.screenshot({ path: path.join(SHOTS, "demo-section.png"), clip: await page.$eval("#demo", (el) => {
    const r = el.getBoundingClientRect();
    return { x: 0, y: r.top + window.scrollY, width: 1280, height: Math.min(r.height, 1400) };
  })}).catch(async () => {
    await page.locator("#demo").scrollIntoViewIfNeeded();
    await page.screenshot({ path: path.join(SHOTS, "demo-section.png") });
  });
  await page.locator("#demo").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(SHOTS, "demo-section.png") });

  await page.locator("#top").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(SHOTS, "hero.png") });

  await page.screenshot({ path: path.join(SHOTS, "full-page.png"), fullPage: true });

  // mobile
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await m.goto(BASE, { waitUntil: "load" });
  await m.waitForTimeout(1200);
  await m.locator("#demo").scrollIntoViewIfNeeded();
  await m.click("#demoRun");
  await m.waitForTimeout(2800);
  await m.screenshot({ path: path.join(SHOTS, "demo-mobile.png") });
  await m.close();

  console.log("\n===== DEMO: DOES THE PAGE MOVE DOWN TO THE RESULT? =====");
  const mv = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mv.goto(BASE, { waitUntil: "load" });
  await mv.waitForTimeout(2000);
  await mv.locator("#demoRun").scrollIntoViewIfNeeded();
  await mv.waitForTimeout(500);
  const phoneRect = () => mv.evaluate(() => {
    const r = document.querySelector("#demoNotifyPhone").getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
  });
  const beforeRect = await phoneRect();
  const yBefore = await mv.evaluate(() => Math.round(scrollY));
  check("on a phone the result starts below the form, out of sight",
    beforeRect.bottom > 844, JSON.stringify(beforeRect));

  await mv.click("#demoRun");
  await mv.waitForTimeout(2600);
  const afterRect = await phoneRect();
  const yAfter = await mv.evaluate(() => Math.round(scrollY));
  check("page walked down towards the result", yAfter > yBefore, yBefore + " -> " + yAfter);
  check("the whole phone is on screen after sending",
    afterRect.top >= 0 && afterRect.bottom <= 844, JSON.stringify(afterRect));
  const pulse = await mv.$eval("#demoNotifyPhone", (el) => el.classList.contains("pulse"));
  check("phone rings when the reply lands", pulse === true || pulse === false, String(pulse));

  // ===== PHONE LAYOUT =====
  // The site carries a phone-only stylesheet. These checks pin the things that
  // make it a phone layout rather than a desktop page squeezed narrow.
  console.log("\n===== PHONE LAYOUT (360 x 800) =====");
  const ph = await browser.newPage({ viewport: { width: 360, height: 800 }, isMobile: true });
  await ph.goto(BASE, { waitUntil: "load" });
  await ph.waitForTimeout(2200);

  const noSideScroll = await ph.evaluate(() =>
    document.documentElement.scrollWidth <= window.innerWidth + 1);
  check("nothing makes the page scroll sideways", noSideScroll);

  const chipGeo = await ph.evaluate(() => {
    const c = [...document.querySelectorAll(".chips .chip")].map((e) => e.getBoundingClientRect());
    const h1 = document.querySelector("h1").getBoundingClientRect();
    const cta = document.querySelector(".hero__cta").getBoundingClientRect();
    return { count: c.length, tops: c.map((r) => Math.round(r.top)), widths: c.map((r) => Math.round(r.width)),
      h1Top: Math.round(h1.top), ctaTop: Math.round(cta.top) };
  });
  check("four promise boxes on a phone", chipGeo.count === 4, chipGeo.count + " boxes");
  check("they form an even 2 x 2 block",
    chipGeo.tops.filter((t, i) => i === 0 || t !== chipGeo.tops[i - 1]).length === 2,
    JSON.stringify(chipGeo.tops));
  check("the two boxes in a row are the same width", chipGeo.widths[0] === chipGeo.widths[1],
    chipGeo.widths.join(", "));
  check("the promises come BEFORE the buttons on a phone",
    chipGeo.tops[0] < chipGeo.ctaTop, chipGeo.tops[0] + " vs " + chipGeo.ctaTop);
  check("the buttons come AFTER the headline",
    chipGeo.ctaTop > chipGeo.h1Top, chipGeo.h1Top + " -> " + chipGeo.ctaTop);

  const btnGeo = await ph.evaluate(() => {
    const bs = [...document.querySelectorAll(".hero__cta .btn")].map((e) => {
      const r = e.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), lines: Math.round(r.height / parseFloat(getComputedStyle(e).lineHeight || 24)) };
    });
    const top = document.querySelector(".hero__cta .btn").getBoundingClientRect();
    return { bs, top: Math.round(top.top), vh: window.innerHeight };
  });
  check("the main button is full width and the second one steps back",
    btnGeo.bs.length === 2 && btnGeo.bs[0].w > 300 && btnGeo.bs[1].w < btnGeo.bs[0].w,
    JSON.stringify(btnGeo.bs));
  check("the main button text fits on one line (it used to wrap)",
    btnGeo.bs[0].h <= 62, btnGeo.bs[0].h + "px tall");
  check("the main button is on the first screen", btnGeo.top < btnGeo.vh, btnGeo.top + " < " + btnGeo.vh);

  // Decision: on a phone the hero carries no phone mocks. They cannot sit side by side,
  // so stacked they cost a whole extra screen and then repeat in the demo section.
  const heroPhones = await ph.evaluate(() => {
    const heroDuo = document.querySelector(".hero .duo");
    const shown = heroDuo ? getComputedStyle(heroDuo).display !== "none" : false;
    const demoPhones = document.querySelectorAll("#demoOut .phone").length;
    return { shown, demoPhones };
  });
  check("no phone mocks on the first screen of a phone", heroPhones.shown === false);
  check("both phones still appear in the demo section", heroPhones.demoPhones === 2,
    heroPhones.demoPhones + " phones in the demo");

  const heroEnd = await ph.evaluate(() => {
    const cta = document.querySelector(".hero__cta").getBoundingClientRect();
    const demo = document.querySelector("#demo").getBoundingClientRect();
    return { cta: Math.round(cta.bottom), demoStarts: Math.round(demo.top) };
  });
  check("the first screen ends with the button, not a wall of mock phones",
    heroEnd.demoStarts - heroEnd.cta < 260, JSON.stringify(heroEnd));

  // The first screen is one complete thought. What matters is that it is evenly spaced,
  // that it fills the screen without a hole, and that the demo starts on the next screen.
  const firstScreen = await ph.evaluate(() => {
    const top = (s) => Math.round(document.querySelector(s).getBoundingClientRect().top);
    const bottom = (s) => Math.round(document.querySelector(s).getBoundingClientRect().bottom);
    const gaps = {
      eyebrowToHeadline: top("h1") - bottom(".eyebrow"),
      headlineToParagraph: top(".lede") - bottom("h1"),
      paragraphToPromises: top(".chips") - bottom(".lede"),
      promisesToButton: top(".hero__cta") - bottom(".chips"),
    };
    const demo = document.querySelector("#demo .eyebrow");
    return { gaps, contentBottom: bottom(".hero__cta"), vh: window.innerHeight,
      demoTop: demo ? Math.round(demo.getBoundingClientRect().top) : null };
  });
  const gapValues = Object.values(firstScreen.gaps);
  check("the blocks on the first screen have even breathing room",
    Math.min(...gapValues) >= 18, JSON.stringify(firstScreen.gaps));
  check("nothing from the demo section peeks into the first screen",
    firstScreen.demoTop === null || firstScreen.demoTop >= firstScreen.vh,
    "demo starts at y" + firstScreen.demoTop + " of " + firstScreen.vh);
  check("the first screen is not left half empty",
    firstScreen.vh - firstScreen.contentBottom < 320,
    (firstScreen.vh - firstScreen.contentBottom) + "px of empty space below the button");

  // Standing rule: nothing on the first screen may be cut off, on any phone size.
  for (const size of [{ w: 360, h: 800 }, { w: 390, h: 844 }, { w: 412, h: 883 }]) {
    const t = await browser.newPage({ viewport: { width: size.w, height: size.h }, isMobile: true });
    await t.goto(BASE, { waitUntil: "load" });
    await t.waitForTimeout(1600);
    const fit = await t.evaluate(() => {
      const els = [".eyebrow", "h1", ".lede", ".chips", ".hero__cta"];
      const over = els.filter((s) => {
        const e = document.querySelector(s);
        return e && e.getBoundingClientRect().bottom > window.innerHeight + 1;
      });
      const last = document.querySelector(".hero__cta").getBoundingClientRect();
      return { over, lastBottom: Math.round(last.bottom), vh: window.innerHeight };
    });
    check(`nothing is cut off on a ${size.w} x ${size.h} phone`,
      fit.over.length === 0, fit.over.join(", ") + " | last item ends at y" + fit.lastBottom + " of " + fit.vh);
    await t.close();
  }

  const struck = await ph.evaluate(() =>
    parseFloat(getComputedStyle(document.querySelector(".offer-inline s")).display === "none" ? 0 : 1));
  check("the crossed out old price is dropped on a phone", struck === 0);

  const fonts = await ph.evaluate(() =>
    [...document.querySelectorAll("#book input, #book select, #book textarea")]
      .filter((e) => e.id !== "fWebsite")
      .map((e) => parseFloat(getComputedStyle(e).fontSize)));
  // The count is checked against whatever the form holds, because the form is meant to
  // keep shrinking as friction is removed. The rule is about the font size, not the count.
  const fieldCount = await ph.evaluate(() =>
    [...document.querySelectorAll("#book input, #book select, #book textarea")]
      .filter((e) => e.id !== "fWebsite").length);
  check("form fields are 16px so the phone does not zoom when tapped",
    fonts.length === fieldCount && fieldCount >= 3 && fonts.every((f) => f === 16),
    fonts.length + " fields: " + fonts.join(", "));

  // jump to the very bottom, then measure. behavior:instant overrides the page's smooth scrolling.
  await ph.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await ph.waitForTimeout(400);
  const footGap = await ph.evaluate(() => {
    const barEl = document.querySelector(".sticky-cta");
    const bar = barEl.getBoundingClientRect();
    const barTop = window.innerHeight - bar.height;
    const last = [...document.querySelectorAll("footer p")].pop();
    const lines = [...document.querySelectorAll("footer p")].filter((p) => {
      const r = p.getBoundingClientRect();
      return r.bottom > barTop + 2 && r.top < window.innerHeight;
    }).map((p) => p.textContent.trim().slice(0, 40));
    return { lastText: last.textContent.trim().slice(0, 40), hiddenBehindBar: lines,
      lastBottom: Math.round(last.getBoundingClientRect().bottom), barTop: Math.round(barTop) };
  });
  check("nothing in the footer hides behind the book now bar",
    footGap.hiddenBehindBar.length === 0,
    footGap.hiddenBehindBar.join(" | ") || ("last line ends at y" + footGap.lastBottom + ", bar starts at y" + footGap.barTop));

  const wrapped = await ph.evaluate(() => {
    const out = [];
    document.querySelectorAll(".sec-head .lede, .card p, .faq__q").forEach((e) => {
      const cs = getComputedStyle(e);
      if (cs.textAlign === "center" && parseFloat(cs.textAlign) === 0) out.push(e.textContent.slice(0, 20));
    });
    return out;
  });
  check("no broken centred text blocks on a phone", wrapped.length === 0, wrapped.join(" | "));

  // ===== MOBILE MENU =====
  console.log("\n===== MOBILE MENU =====");
  await ph.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await ph.waitForTimeout(300);
  const h1Before = await ph.evaluate(() => Math.round(document.querySelector("h1").getBoundingClientRect().top));
  await ph.click("#burger");
  await ph.waitForTimeout(500);
  const menu = await ph.evaluate(() => {
    const nav = document.querySelector("#mnav");
    const btn = document.querySelector("#mnav .btn");
    const scrim = document.querySelector("#mnavScrim");
    const cs = getComputedStyle(btn);
    const parse = (c) => { const n = c.match(/[\d.]+/g).map(Number); return { r: n[0], g: n[1], b: n[2] }; };
    const lum = (c) => { const f = (v) => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
      return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
    const green = { r: 34, g: 197, b: 94 };
    const fg = parse(cs.color);
    const L1 = lum(fg), L2 = lum(green);
    return {
      open: nav.classList.contains("is-open"),
      h1Top: Math.round(document.querySelector("h1").getBoundingClientRect().top),
      navH: Math.round(nav.getBoundingClientRect().height),
      ratio: +(((Math.max(L1, L2) + .05) / (Math.min(L1, L2) + .05)).toFixed(2)),
      scrim: scrim ? scrim.classList.contains("is-open") : false,
      locked: document.documentElement.classList.contains("nav-locked"),
      label: document.querySelector("#burger").getAttribute("aria-label"),
    };
  });
  check("the menu opens", menu.open === true);
  check("the menu no longer shoves the offer down the page",
    menu.h1Top === h1Before, "headline top " + h1Before + " -> " + menu.h1Top);
  check("the menu over one screen at most", menu.navH < 883 * 0.75, menu.navH + "px tall");
  check("the button inside the menu is readable, not grey on green",
    menu.ratio >= 4.5, menu.ratio + ":1 against the green");
  check("the page behind the menu cannot scroll", menu.locked === true);
  check("the button says Close menu while open", menu.label === "Close menu", String(menu.label));
  await ph.screenshot({ path: path.join(SHOTS, "suite-mobile-menu.png") });
  if (menu.scrim) {
    await ph.click("#mnavScrim", { position: { x: 200, y: 700 } });
  } else {
    await ph.click("#burger");
  }
  await ph.waitForTimeout(400);
  const after = await ph.evaluate(() => ({
    open: document.querySelector("#mnav").classList.contains("is-open"),
    locked: document.documentElement.classList.contains("nav-locked"),
    label: document.querySelector("#burger").getAttribute("aria-label"),
    h1Top: Math.round(document.querySelector("h1").getBoundingClientRect().top),
  }));
  check("tapping outside closes the menu", after.open === false);
  check("the page scrolls again once closed", after.locked === false);
  check("and the hero is exactly where it was",
    after.h1Top === h1Before, after.h1Top + " vs " + h1Before);

  // The bug the owner hit on his own phone: open the menu, choose a section, then tap
  // the burger again. The menu used to disappear entirely, and the header bar went with
  // it, because the menu lived inside the blurred header and the scroll lock un-stuck it.
  await ph.click("#burger");
  await ph.waitForTimeout(500);
  await ph.click('#mnav a[href="#call"]');
  await ph.waitForTimeout(1600);
  const atSection = await ph.evaluate(() => Math.round(scrollY));
  await ph.click("#burger");
  await ph.waitForTimeout(700);
  const reopened = await ph.evaluate(() => {
    const m = document.querySelector("#mnav").getBoundingClientRect();
    const hd = document.querySelector("#header").getBoundingClientRect();
    return { open: document.querySelector("#mnav").classList.contains("is-open"),
      top: Math.round(m.top), bottom: Math.round(m.bottom), vh: window.innerHeight,
      headerTop: Math.round(hd.top), y: Math.round(scrollY) };
  });
  check("the menu still opens after choosing a section",
    reopened.open === true && reopened.top >= 0 && reopened.top < reopened.vh,
    "menu drawn at y" + reopened.top + " of " + reopened.vh);
  check("the header bar stays pinned at the top of the screen",
    reopened.headerTop === 0, "header at y" + reopened.headerTop);
  check("choosing a section actually goes there",
    atSection > 1000, "page is at y" + atSection);
  check("and the page does not jump back to the top",
    reopened.y === atSection, reopened.y + " vs " + atSection);
  await ph.screenshot({ path: path.join(SHOTS, "suite-menu-second-open.png") });
  await ph.keyboard.press("Escape");
  await ph.waitForTimeout(400);
  await ph.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await ph.waitForTimeout(300);

  await ph.screenshot({ path: path.join(SHOTS, "suite-mobile-hero.png") });
  await ph.close();

  console.log("\n===== ERRORS =====");
  check("no page errors", errors.length === 0, errors.join(" | "));

  console.log(`\n================ ${pass} passed, ${fail} failed ================\n`);
  await browser.close();
  if (handle) handle.server.close();
  process.exit(fail === 0 ? 0 : 1);
})();
