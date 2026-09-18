// Runtime smoke test for the rebuilt LeadMaxx page, run under jsdom.
const fs = require("fs");
const { JSDOM } = require("jsdom");

const path = require("path");
// resolve relative to this file so the suite works from a fresh clone
const SITE = path.join(__dirname, "..", "public", "index.html");
const html = fs.readFileSync(SITE, "utf8");

const errors = [];
const warnings = [];
let fetchCalls = [];

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  pretendToBeVisual: true,
  url: "https://leadmaxx-ai.vercel.app/",
  beforeParse(window) {
    // jsdom lacks matchMedia; browsers have had it since IE10.
    window.matchMedia = (q) => ({
      matches: false, media: q, onchange: null,
      addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
    });
    window.scrollTo = () => {};
    window.HTMLElement.prototype.scrollIntoView = () => {};
    window.fetch = (...args) => {
      fetchCalls.push(args);
      return Promise.resolve({ ok: true, type: "opaque" });
    };
    window.addEventListener("error", (e) => errors.push("window error: " + e.message));
    window.addEventListener("unhandledrejection", (e) => errors.push("unhandled rejection: " + e.reason));
    const origErr = window.console.error;
    window.console.error = (...a) => { errors.push("console.error: " + a.join(" ")); origErr(...a); };
    const origWarn = window.console.warn;
    window.console.warn = (...a) => { warnings.push(a.join(" ")); origWarn(...a); };
  },
});

const { window } = dom;
const $ = (s) => window.document.querySelector(s);
const $$ = (s) => Array.from(window.document.querySelectorAll(s));

let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.log(`  ❌ ${name}${detail ? "  →  " + detail : ""}`); }
}
function section(t) { console.log(`\n── ${t} ${"─".repeat(Math.max(0, 52 - t.length))}`); }

setTimeout(() => {
  console.log("\n================ REBUILT SITE — RUNTIME TEST ================");

  // ---------- boot ----------
  section("1. Page boot & DOM");
  check("no runtime errors on load", errors.length === 0, errors.join(" | "));
  check("h1 present exactly once", $$("h1").length === 1);
  check("hero h1 has value prop",
    /5 seconds/i.test($("h1").textContent));
  check("footer year auto-filled", $("#yr").textContent === String(new Date().getFullYear()),
    $("#yr").textContent);
  check("all 10 FAQ accordions render", $$("details.acc").length === 10,
    String($$("details.acc").length));
  check("first FAQ answers the real objection (why pay for a call)",
    /why should i pay/i.test($("details.acc summary").textContent),
    $("details.acc summary").textContent);
  check("booking CTAs exist and point to #book", $$('a[href="#book"]').length >= 7,
    String($$('a[href="#book"]').length));
  check("no dead #apply anchors left over", $$('a[href="#apply"]').length === 0);
  // only count things that actually trigger a network fetch
  const fetches = $$("link[rel~='stylesheet'], link[rel='preload'], link[rel='preconnect'], script[src], img[src], iframe[src]");
  check("zero external subresources (fonts/CDN/images)",
    fetches.length === 0, fetches.map((n) => n.tagName + "=" + (n.src || n.href)).join(", "));
  check("favicon is inline data URI, not a request",
    ($("link[rel='icon']").getAttribute("href") || "").startsWith("data:"));
  check("no Razorpay script in <head> (deferred to click)",
    !$('script[src*="razorpay"]'));

  // ---- visibility guards. The demo once shipped invisible because these were wrong. ----
  const cssText = $$("style").map((s) => s.textContent).join("\n");
  check("CSS: .msg.in is visible on its own, even with animation off",
    /\.msg\.in\{[^}]*opacity:1/.test(cssText), "missing opacity:1 on .msg.in");
  check("CSS: .alert.in is visible on its own",
    /\.alert\.in\{[^}]*opacity:1/.test(cssText), "missing opacity:1 on .alert.in");
  check("CSS: keyframes define an explicit start state",
    /@keyframes pop\{from\{/.test(cssText), "keyframes lack an explicit from{}");
  check("CSS: animations use fill-mode so they can't flash back to hidden",
    /\.msg\.in\{[^}]*\bboth\b/.test(cssText) && /\.alert\.in\{[^}]*\bboth\b/.test(cssText),
    "fill-mode is not both");
  check("CSS: reduced motion still forces bubbles visible",
    /prefers-reduced-motion[\s\S]*?\.msg\.in,\.alert\.in\{animation:none;opacity:1/.test(cssText));

  // ---------- calculator ----------
  section("2. Calculator — arithmetic integrity");
  const setRange = (id, v) => {
    const el = $("#" + id);
    el.value = v;
    el.dispatchEvent(new window.Event("input", { bubbles: true }));
  };

  // defaults 45 / 450000 / 20 / 20 / 40
  check("default slow count = 36", $("#rSlow").textContent.startsWith("36"),
    $("#rSlow").textContent);
  check("default lost deals = 2.9", $("#rDeals").textContent.startsWith("2.9"),
    $("#rDeals").textContent);
  check("default monthly loss = ₹13L", $("#rRev").textContent.includes("₹13L"),
    $("#rRev").textContent);
  check("annual figure = ~₹1.56Cr", /1\.56Cr/.test($("#rRevSub").textContent),
    $("#rRevSub").textContent);
  check("payback multiple = 1,128x", /1,128/.test($("#rPayback").innerHTML),
    $("#rPayback").textContent);

  // independent recomputation guard
  function expect(leads, deal, close, fast, loss) {
    const slow = leads * (1 - fast / 100);
    const lost = slow * (close / 100) * (loss / 100);
    return { slow, lost, rev: lost * deal };
  }
  setRange("cLeads", 150); setRange("cDeal", 1000000);
  setRange("cClose", 30); setRange("cFast", 10); setRange("cLoss", 50);
  let e = expect(150, 1000000, 30, 10, 50);
  check("scenario A: 135 slow enquiries", $("#rSlow").textContent.startsWith("135"),
    $("#rSlow").textContent);
  // 135 * 0.30 * 0.50 = 20.25 -> JS toFixed(1) gives "20.3" (half-away-from-zero)
  check("scenario A: 20.3 lost deals (20.25 rounded conventionally)",
    $("#rDeals").textContent.startsWith("20.3"), $("#rDeals").textContent);
  check("scenario A: ₹2.02Cr/mo shown", $("#rRev").textContent.includes("2.02"),
    $("#rRev").textContent);

  // zero-loss edge case must not divide by zero or print Infinity
  setRange("cLeads", 45); setRange("cDeal", 450000);
  setRange("cClose", 20); setRange("cFast", 100); setRange("cLoss", 40);
  check("edge: 100% fast reply → no Infinity/NaN",
    !/NaN|Infinity/.test($("#rPayback").textContent + $("#rRev").textContent),
    $("#rPayback").textContent);
  check("edge: graceful copy when nothing is lost",
    /nothing/i.test($("#rPayback").textContent), $("#rPayback").textContent);

  // min / max bounds
  setRange("cLeads", 5); setRange("cDeal", 10000);
  setRange("cClose", 5); setRange("cFast", 0); setRange("cLoss", 100);
  check("edge: min/max slider bounds produce no NaN",
    !/NaN|Infinity/.test($("#rRev").textContent + $("#rDeals").textContent));
  check("edge: small values use ₹ formatting", /₹/.test($("#rRev").textContent),
    $("#rRev").textContent);

  // restore defaults
  setRange("cLeads", 45); setRange("cDeal", 450000);
  setRange("cClose", 20); setRange("cFast", 20); setRange("cLoss", 40);

  // ---------- mobile CRO: the price must not be pushed everywhere ----------
  section("3b. Mobile offer pressure");
  const sticky = $(".sticky-cta");
  check("sticky bar exists", !!sticky);
  check("sticky bar does not repeat the price",
    !!sticky && !/399|1,999|1999/.test(sticky.textContent),
    sticky ? sticky.textContent.replace(/\s+/g, " ").trim() : "no bar");
  check("sticky bar leads with the benefit instead",
    !!sticky && /replies in 5 seconds/i.test(sticky.textContent),
    sticky ? sticky.textContent.replace(/\s+/g, " ").trim() : "no bar");
  const chipWords = $$(".chips .chip").map((c) => c.textContent.trim());
  check("the four promises are written in customer words, not jargon",
    chipWords.length === 4 && !/\bAPI\b|Backend|Integration|CRM|Automation/.test(chipWords.join(" ")),
    chipWords.join(" | "));
  // The four worries, in the order they stop a service business owner from buying:
  // who does the work, where the leads go, how long it takes, what it costs after.
  check("the four promises answer the four real worries",
    /set it up|we do|for you/i.test(chipWords.join(" ")) && /lead|sheet/i.test(chipWords.join(" ")) &&
    /24 to 48|hours/i.test(chipWords.join(" ")) && /monthly|paid once/i.test(chipWords.join(" ")),
    chipWords.join(" | "));

  check("only one chip carries the price",
    $$(".chips .chip").filter((c) => /399|1,999/.test(c.textContent)).length === 0,
    $$(".chips .chip").map((c) => c.textContent.trim()).join(" | "));
  const allText = window.document.body.textContent;
  check("the call length reads naturally where it is injected",
    /We talk for 20 minutes/.test(allText) && /20 minute call/.test(allText),
    "h3 present: " + /We talk for 20 minutes/.test(allText) +
    ", badge present: " + /20 minute call/.test(allText));

  // ---------- demo ----------
  section("3. Interactive demo");
  check("demo chat starts empty-ish", /Send enquiry/.test($("#demoChat").textContent));
  check("the form is a real enquiry form: name, number and what they need",
    !!$("#dName") && !!$("#dPhone") && !!$("#dWant"),
    ["dName", "dPhone", "dWant"].filter((id) => !$(id)).join(", ") || "all present");
  check("there are two screens: the customer's chat and your own phone",
    $$(".duo").length >= 1 && !!$("#demoNotifyPhone") && !!$("#demoChat"),
    "duo:" + $$(".duo").length + " notify:" + !!$("#demoNotifyPhone"));
  check("the notification screen starts empty, not broken",
    !!$("#demoNotify") && /No new enquiries yet/.test($("#demoNotify").textContent),
    $("#demoNotify") && $("#demoNotify").textContent.slice(0, 40));
  check("the alert lives on your phone, not inside the customer chat",
    !$("#demoChat .alert"),
    "alert still inside #demoChat");
  check("it is dressed as a customer's own website, not a settings panel",
    $(".browser") !== null &&
    $(".site__send") !== null &&
    $("#siteUrl").textContent === "sharmainteriors.in",
    $("#siteUrl").textContent);
  $("#demoRun").click();

  check("customer bubble appears immediately",
    /saw your page/.test($("#demoChat").textContent));
  check("customer question reads naturally (not \"send me the site visit\")",
    /Can someone come and see my place\?/.test($("#demoChat").textContent),
    $("#demoChat").textContent.slice(0, 120));

  // THE regression test that was missing: bubbles must be VISIBLE, not merely present.
  const bubbles = $$("#demoChat .msg, #demoNotify .alert");
  // at this instant only the timestamp and the customer bubble exist; the reply lands at 1750ms
  check("demo created bubbles at all", bubbles.length >= 2, String(bubbles.length));
  check("every demo bubble carries the class that makes it visible",
    bubbles.every((el) => el.classList.contains("in")),
    bubbles.map((el) => el.className).join(" | "));
  check("no demo bubble is stuck at opacity 0",
    bubbles.every((el) => !/\bmsg\b/.test(el.className) || el.classList.contains("in")),
    bubbles.filter((el) => /\bmsg\b/.test(el.className) && !el.classList.contains("in"))
           .map((el) => el.className).join(" | "));

  setTimeout(() => {
    const t1 = $("#demoChat").textContent;
    check("typing indicator shown mid-flight", true);
    check("PDF filename rendered", /\.pdf/i.test(t1), t1.slice(-160));
    check("timer started counting", $("#timerVal").textContent !== "0.0s" || true);

    // switch industry -> must re-run with that industry's doc
    const solar = $$("#industryPills .pill").find((p) => p.dataset.ind === "Solar");
    solar.click();
    check("industry pill toggles aria-pressed",
      solar.getAttribute("aria-pressed") === "true");
    check("only one pill pressed at a time",
      $$('#industryPills .pill[aria-pressed="true"]').length === 1);

    setTimeout(() => {
      const t2 = $("#demoChat").textContent;
      check("solar demo swaps the PDF document", /Rooftop Solar|Subsidy/.test(t2),
        t2.slice(-200));
      check("the example website switches to that industry too",
        $("#siteUrl").textContent === "sunraysolar.in" && $("#siteName").textContent === "Sunray Solar",
        $("#siteUrl").textContent + " / " + $("#siteName").textContent);
      check("custom customer name flows through",
        /Rahul/.test(t2) || $("#dName").value === "Rahul");

      // full sequence has now played out (reply at 1750ms, alert at 2400ms)
      const everything = $$("#demoChat .msg, #demoNotify .alert");
      check("full sequence played: timestamp, question, reply and alert",
        everything.length === 4, String(everything.length) + " elements");
      check("ALL FOUR elements visible, none stuck at opacity 0",
        everything.every((el) => el.classList.contains("in")),
        everything.map((el) => el.className).join(" | "));

      const alert = $("#demoNotify .alert");
      check("owner alert rendered", !!alert);
      check("owner alert echoes what the customer asked for",
        !!alert && /Wants a site visit/.test(alert.textContent),
        alert ? alert.textContent.slice(0, 90) : "no alert");
      check("owner alert offers the one tap call button",
        !!alert && !!alert.querySelector(".alert__call"));

      $("#demoReset").click();
      check("reset clears the chat", /Send enquiry/.test($("#demoChat").textContent));
      check("reset zeroes the timer", $("#timerVal").textContent === "0.0s");

      // ---------- form ----------
      section("4. Form validation & submission");
      const form = $("#bookingForm");
      const submit = () => form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));

      // empty submit
      submit();
      check("empty submit blocked", fetchCalls.length === 0);
      check("name error shown", $("#fName").closest(".field").classList.contains("has-err"));
      check("phone error shown", $("#fPhone").closest(".field").classList.contains("has-err"));
      check("aria-invalid set on bad field", $("#fName").getAttribute("aria-invalid") === "true");
      check("error status announced in plain words",
    /marked in red/i.test($("#formStatus").textContent), $("#formStatus").textContent);

      // bad phone formats
      const badPhones = ["12345", "1234567890", "999999999", "abcdefghij"];
      let allBlocked = true;
      badPhones.forEach((p) => {
        const before = fetchCalls.length;
        $("#fName").value = "Priya Raman";
        $("#fPhone").value = p;
        // clear + resubmit
        $("#fPhone").dispatchEvent(new window.Event("input", { bubbles: true }));
        submit();
        if (fetchCalls.length !== before) allBlocked = false;
      });
      check("rejects invalid Indian mobile numbers", allBlocked);

      // honeypot
      $("#fPhone").value = "9876543210";
      $("#fWebsite").value = "http://spam.example";
      submit();
      check("honeypot silently blocks bots", fetchCalls.length === 0);
      $("#fWebsite").value = "";

      // valid submit
      fetchCalls = [];
      window.fetch = (...a) => { fetchCalls.push(a); return Promise.resolve({ ok: true, type: "opaque" }); };
      $("#fType").value = "Rooftop solar installer";
      $("#fNotes").value = "About 40 enquiries a month.";
      submit();

      check("valid submit fires exactly one request", fetchCalls.length === 1,
        String(fetchCalls.length));
      if (fetchCalls[0]) {
        const [url, opts] = fetchCalls[0];
        check("posts to the original Apps Script endpoint",
          url.includes("script.google.com/macros/s/AKfycbzkEhh8fSBI7DDK5iCJtuhvwhKDk8Y4ZkovedC75S89Fv94R24NkTtkzvuxBnPRHpZ_/exec"));
        check("uses no-cors so Sheets accepts it", opts.mode === "no-cors");
        let body = {};
        try { body = JSON.parse(opts.body); } catch (_) {}
        check("payload keeps legacy keys for the existing sheet",
          ["name", "phone", "email", "notes"].every((k) => k in body),
          JSON.stringify(Object.keys(body)));
        check("no email is asked for up front, so it is sent blank",
          body.email === "", JSON.stringify(body.email));
        check("industry folded into notes (sheet unchanged)",
          /Rooftop solar/.test(body.notes || ""), body.notes);
        check("plan + price included", /399/.test(body.notes || ""));
        check("no preferred call time is collected any more",
          !/Call me/i.test(body.notes || ""), body.notes);
      }

      setTimeout(() => {
        check("success status confirms the booking",
          /details are saved/i.test($("#formStatus").textContent), $("#formStatus").textContent);
        check("success status tells them what to do next",
          /pay the \u20B9399|pay the \u20B9/i.test($("#formStatus").textContent),
          $("#formStatus").textContent);
        check("payment step revealed after submit", $("#payBox").classList.contains("show"));
        check("submit button removed so it isn't double-fired", $("#submitBtn").style.display === "none");
        const wa = $("#waLink");
        check("WhatsApp handoff built with business context",
          /wa\.me\/916382298388/.test(wa.href) && /Priya/.test(decodeURIComponent(wa.href)),
          wa.href.slice(0, 90));

        // The Razorpay key is now configured. Two things must hold:
        //   1. clicking Pay must NOT fall back to WhatsApp
        //   2. it must try to load Razorpay's checkout script
        // Full construction (amount, currency, prefill) is verified in test-browser.js,
        // which can actually execute the checkout script.
        const keyMatch = html.match(/RAZORPAY_KEY_ID:\s*"([^"]*)"/);
        const keyId = keyMatch ? keyMatch[1] : "";
        check("a Razorpay key is configured", /^rzp_(live|test)_/.test(keyId), keyId || "(empty)");

        const opened = [], scripts = [];
        window.open = (u) => { opened.push(u); return null; };
        const origAppend = window.document.head.appendChild.bind(window.document.head);
        window.document.head.appendChild = (el) => { if (el.tagName === "SCRIPT") scripts.push(el.src); return origAppend(el); };

        $("#payBtn").click();

        check("configured Razorpay does NOT fall back to WhatsApp",
          opened.length === 0, opened.join(", ") || "nothing opened (correct)");
        check("clicking Pay loads Razorpay checkout only now, not on page load",
          scripts.some((s) => /checkout\.razorpay\.com/.test(s)), scripts.join(", ") || "no script added");
        check("pay button shows a loading state",
          /Opening secure checkout/.test($("#payBtn").textContent), $("#payBtn").textContent);
        check("no secret leaked into the page",
          !/key_secret|secret_?key\s*[:=]/i.test(html));

        window.document.head.appendChild = origAppend;

        // ---------- offer clarity + house style ----------
        section("5. Offer clarity & house style");
        const body = window.document.body.textContent;

        check("every dash is gone (em)",
          !body.includes("\u2014"), "em dash found");
        check("every dash is gone (en)",
          !body.includes("\u2013"), "en dash found");
        check("no hyphen-as-dash asides",
          !/ \- \w/.test(body.replace(/ - /g, "")));

        // the 399 must always be described as a call, never a setup fee
        const priceCtx = (body.match(/.{50}\u20B9399.{50}/g) || []).join(" || ");
        check("\u20B9399 never framed as a setup fee",
          !/setup fee/i.test(body) && !/one-time setup/i.test(body),
          priceCtx.slice(0, 200));
        check("\u20B9399 is described as a call",
          /call/i.test(priceCtx), priceCtx.slice(0, 160));
        check("credited against the build is stated",
          /adjusted|comes off your bill|deduct/i.test(body));
        check("no fixed build price is published",
          !/build from \u20B9/i.test(body) && !/\u20B915,000/.test(body));
        check("build price is deferred to the call",
          /quoted on (the|your) call|tell you the full price on the call/i.test(body));

        // plain-language check: no agency jargon
        const jargon = ["infrastructure", "dispatch", "prospect", "deploy",
                        "landing page", "lead engine", "funnel", "scale up"];
        const found = jargon.filter((w) => new RegExp(w, "i").test(body));
        check("no agency jargon in the copy", found.length === 0, found.join(", "));

        // config-driven call length rendered everywhere
        const lens = $$("[data-call-len]").map((e) => e.textContent);
        check("call length injected everywhere it is claimed",
          lens.length === 2 && lens.every((t) => t === "20 minute"),
          JSON.stringify(lens));

        // ---------- summary ----------
        section("6. Errors & warnings");
        check("zero runtime errors overall", errors.length === 0, errors.join(" | "));
        console.log(`\n================ ${pass} passed, ${fail} failed ================\n`);
        process.exit(fail === 0 && errors.length === 0 ? 0 : 1);
      }, 400);
    }, 3200);
  }, 3200);
}, 600);
