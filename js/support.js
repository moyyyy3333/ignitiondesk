/**
 * Ignition — support widget. Floating "Questions?" helper answering common
 * questions from a local FAQ. No network; unmatched questions go to email.
 */
(function () {
  const MAIL = "help@ignitiondesk.biz";

  const KB = [
    {
      q: "What is Ignition?",
      k: ["what is ignition", "what do you do", "what is this", "how does it work", "who are you"],
      a: "Ignition runs a strict 30-day sprint that builds a new LLC's business credit foundation. The desk automates the paperwork the day it's due — NAP block, operating agreement, DUNS packet, three vendor applications — and you do the few steps that legally need you. The 30-day clock starts when your business bank account opens; follow every deadline after that and your LLC has an open credit line by day 30, or your money back.",
    },
    {
      q: "How does the guarantee work?",
      k: ["guarantee", "money back", "refund", "promise", "guaranteed loan"],
      a: "Sprint Pass only. Clock starts when the LLC checking account is open and pre-flight is done. You request free DUNS by day 4 and file the three Sprint vendor applications on time. If day 30 arrives with no written vendor net-30 terms in the LLC name, email the Proof Pack within 14 days for a full $149 refund. Day 20 is a written review plus one revised packet — we do not call vendors as you. We never guarantee a bank loan.",
    },
    {
      q: "Is a net-30 account really credit?",
      k: ["net-30", "net 30", "really credit", "trade credit", "count as credit", "vendor account"],
      a: "Yes. A net-30 account is a supplier shipping you goods now against your company's promise to pay in 30 days — credit extended to the LLC, in the LLC's name, with payment history that reports to business bureaus. It's how nearly every business credit file on earth starts. What it isn't: a cash loan.",
    },
    {
      q: "How much does it cost?",
      k: ["cost", "price", "pricing", "how much", "expensive", "pay"],
      a: "Preview is free. Documents only (operating agreement, NAP, EIN and bank packets) are $29 with no guarantee. The Sprint Pass is $149 one-time: vendor packets, dated checklist, day-20 written review, and a refund if an on-time file still has no written vendor net-30 terms by day 30. No subscription.",
    },
    {
      q: "Why 30 days? Others say months.",
      k: ["30 days", "how fast", "timeline", "how long", "months", "too fast"],
      a: "Both are true. Within 30 days of your bank account opening you can absolutely have the foundation complete and your first vendor credit line open — that's what we guarantee. A deep file (multiple reporting tradelines, Paydex, card approvals, loan conversations) takes months of on-time payments after that. We guarantee the 30-day part because it's real; we refuse to promise the months part faster because that would be a lie.",
    },
    {
      q: "Do I need an SSN?",
      k: ["ssn", "social security", "personal guarantee", "personal credit check"],
      a: "No SSN is required to open a sprint or use Ignition. Down the road some card issuers ask for one for identity or a personal guarantee — that's their call, and the desk flags when a step touches your personal credit.",
    },
    {
      q: "What's an EIN and where do I get one?",
      k: ["ein", "tax id", "employer identification"],
      a: "An EIN is the LLC's federal tax ID — day 1 of your sprint. The IRS issues it free at irs.gov/ein, online, in minutes. Anyone charging for an EIN is a middleman. You file it yourself; that step needs your face.",
    },
    {
      q: "What's a DUNS number?",
      k: ["duns", "dun & bradstreet", "dnb"],
      a: "Dun & Bradstreet's ID for your company — most supplier reporting hangs off it. Free at dnb.com, requested on day 8 of the sprint because it takes 2–4 weeks to issue. Never pay a reseller for 'expedited' DUNS.",
    },
    {
      q: "What happens if I miss a day?",
      k: ["miss a day", "fall behind", "late", "behind schedule", "missed deadline"],
      a: "The desk shows you overdue steps and you can still finish — the sprint doesn't lock. But the guarantee requires every step done on schedule, so falling badly behind voids the refund. Catch up fast; the desk tells you exactly what's overdue.",
    },
    {
      q: "Is this legit?",
      k: ["scam", "legit", "trust", "too good", "fake"],
      a: "Fair question — this space is full of garbage. We sell a disciplined program, not shortcuts: no seasoned tradelines, no CPNs, no guaranteed bank approvals, no paid EIN or DUNS 'expediting'. Everything official (IRS, D&B, your bank) you do yourself for free, and we tell you exactly where. Our guarantee is backed by our own refund, not by any lender's promise.",
    },
    {
      q: "Where's my data kept?",
      k: ["where is my data", "data stored", "privacy", "my information", "sell my data"],
      a: "Your sprint file lives in this browser's local storage — it never touches our servers until you export it. Payments run through Stripe; we never see your card. Full details in the Privacy policy in the footer.",
    },
    {
      q: "Can you open the bank account for me?",
      k: ["bank account", "open account", "business checking", "do it for me", "file for me"],
      a: "No — and walk away from anyone who says yes. The EIN, the bank account, and identity verification legally need you. What Ignition does is make those trips painless: exact document stack, exact name string, in your hand before you walk in.",
    },
    {
      q: "How do I reach a human?",
      k: ["contact", "email", "support", "human", "talk to someone", "reach you"],
      a: "Email " + MAIL + " — a person reads it. Include your LLC name if it's about a sprint. If nothing's approved by day 20, that same address triggers the free hands-on intervention.",
    },
  ];

  function tokenize(t) {
    return t.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
  }

  function answer(text) {
    const t = " " + tokenize(text) + " ";
    let best = null;
    let bestScore = 0;
    for (const e of KB) {
      let score = 0;
      for (const k of e.k) {
        if (t.includes(" " + k + " ")) score += k.includes(" ") ? 2 : 1;
      }
      if (score > bestScore) {
        bestScore = score;
        best = e;
      }
    }
    return best;
  }

  const FALLBACK =
    "I don't have a canned answer for that one. Email " + MAIL +
    " and a human will get back to you — or try one of the questions below.";

  function init() {
    const root = document.createElement("div");
    root.className = "support";
    root.innerHTML =
      '<button type="button" class="support-fab" aria-expanded="false" aria-controls="support-panel">Questions?</button>' +
      '<div class="panel support-panel" id="support-panel" hidden>' +
      '<p class="eyebrow" style="margin:0 0 0.5rem">Ask Ignition</p>' +
      '<div class="log support-log"></div>' +
      '<div class="chips support-chips"></div>' +
      '<form class="support-form">' +
      '<label class="sr-only" for="support-q">Your question</label>' +
      '<input id="support-q" placeholder="Guarantee, pricing, timelines…" autocomplete="off" />' +
      '<button class="btn btn-sm btn-primary" type="submit">Ask</button>' +
      "</form></div>";
    document.body.appendChild(root);

    const fab = root.querySelector(".support-fab");
    const panel = root.querySelector(".support-panel");
    const log = root.querySelector(".support-log");
    const chips = root.querySelector(".support-chips");
    const form = root.querySelector(".support-form");
    const input = root.querySelector("#support-q");

    KB.slice(0, 5).forEach((e) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = e.q;
      b.addEventListener("click", () => ask(e.q));
      chips.appendChild(b);
    });

    function esc(t) {
      return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function ask(q) {
      const e = answer(q);
      log.insertAdjacentHTML(
        "beforeend",
        '<div><div class="who">You</div><div class="msg">' + esc(q) + "</div></div>" +
          '<div><div class="who">Ignition</div><div class="msg">' + esc(e ? e.a : FALLBACK) + "</div></div>"
      );
      log.scrollTop = log.scrollHeight;
    }

    fab.addEventListener("click", () => {
      const open = panel.hidden;
      panel.hidden = !open;
      fab.setAttribute("aria-expanded", String(open));
      if (open && !log.childElementCount) {
        log.insertAdjacentHTML(
          "beforeend",
          '<div><div class="who">Ignition</div><div class="msg">Ask anything — the guarantee, pricing, what 30 days really gets you. Short honest answers.</div></div>'
        );
      }
      if (open) input.focus();
    });

    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      input.value = "";
      ask(q);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
