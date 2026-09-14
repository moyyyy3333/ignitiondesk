/**
 * Ignition — 30-day business credit sprint. Local-first.
 * Free: days 1–3 preview. Sprint Pass unlocks the full 30 days + packets.
 * Guarantee: every step done on schedule => at least one open credit line
 * in the LLC's name by day 30, or 100% refund.
 */
(function () {
  const STORAGE = "ignition-sprint-v1";
  const MAIL = "help@ignitiondesk.biz";

  const STATES = [
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
    "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
    "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
    "VA","WA","WV","WI","WY","DC",
  ];

  const INDUSTRIES = [
    { id: "wholesale", label: "Wholesale / distribution", naics: "423990" },
    { id: "construction", label: "Construction / trades", naics: "236220" },
    { id: "retail", label: "Retail", naics: "455000" },
    { id: "professional", label: "Professional services", naics: "541990" },
    { id: "manufacturing", label: "Manufacturing", naics: "339999" },
    { id: "other", label: "Other", naics: "999999" },
  ];

  /**
   * The sprint. Pre-flight tasks (day 0) have no clock — the 30 days start
   * the moment you mark the business bank account open. kind "auto" = the
   * desk does it when due. kind "human" = only you can; deadline enforced.
   */
  const PLAN = [
    { day: 0,  id: "nap",      kind: "auto",  title: "Lock canonical NAP",                 note: "One exact name/address/phone string, used everywhere." },
    { day: 0,  id: "ein",      kind: "human", title: "Get free EIN at IRS.gov",            note: "Same-day online. Never pay for an EIN.", href: "https://www.irs.gov/ein" },
    { day: 0,  id: "oa",       kind: "auto",  title: "Draft operating agreement",          note: "The bank asks for it. Drafted from your file." },
    { day: 0,  id: "bank",     kind: "human", title: "Open business checking — starts the 30 days", note: "Walk in with the bank stack. The clock starts when you mark this done." },
    { day: 1,  id: "site",     kind: "auto",  title: "Draft one-page website copy",        note: "Vendors and bureaus check you exist." },
    { day: 1,  id: "email",    kind: "auto",  title: "Business email plan",                note: "hello@ your domain. No gmail on applications." },
    { day: 2,  id: "phone",    kind: "human", title: "Get a business phone number",        note: "A VoIP number listable in directories works." },
    { day: 3,  id: "google",   kind: "human", title: "Create Google Business listing",     note: "Verification takes days — start now." },
    { day: 4,  id: "duns",     kind: "auto",  title: "Prepare DUNS request packet",        note: "Free at dnb.com. Drafted; you submit." },
    { day: 4,  id: "dunsgo",   kind: "human", title: "Submit DUNS request at dnb.com",     note: "Free. 2–4 weeks to issue — which is why it's day 4, not 24.", href: "https://www.dnb.com/duns-number/get-a-duns.html" },
    { day: 6,  id: "v1",       kind: "auto",  title: "Vendor application #1 — Uline",      note: "Reports to Experian Business. Paste-ready." },
    { day: 7,  id: "v1go",     kind: "human", title: "Submit the Uline application",       note: "Same NAP block, character for character." },
    { day: 8,  id: "v2",       kind: "auto",  title: "Vendor application #2 — Quill",      note: "Second reporting line." },
    { day: 9,  id: "v2go",     kind: "human", title: "Submit the Quill application",       note: "Same NAP block again." },
    { day: 10, id: "v3",       kind: "auto",  title: "Vendor application #3 — Grainger",   note: "Third reporting line." },
    { day: 11, id: "v3go",     kind: "human", title: "Submit the Grainger application",    note: "Three applications in. Approvals typically land in days." },
    { day: 14, id: "order",    kind: "human", outcome: true, title: "Place one small order at each",      note: "Real purchases create the invoices that report. Needs an approval first." },
    { day: 18, id: "firstline",kind: "human", outcome: true, title: "Confirm your first open credit line",note: "Net-30 terms approved = real trade credit in the LLC's name. Nothing yet? Email " + MAIL + " — we work your file free." },
    { day: 24, id: "pay",      kind: "human", outcome: true, title: "Pay each invoice the day it lands",  note: "From the LLC checking, in full. This is what reports. Only once an invoice exists." },
    { day: 30, id: "audit",    kind: "auto",  title: "Day-30 file audit + guarantee check",note: "Everything verified — or your refund window opens." },
  ];

  const PHASES = [
    { label: "Pre-flight", to: 0 },
    { label: "Identity", to: 3 },
    { label: "Bureaus", to: 5 },
    { label: "Vendors", to: 13 },
    { label: "Credit live", to: 30 },
  ];

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE) || "null");
    } catch {
      return null;
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  /* ---------- Celebrations ---------- */
  const SPARK_COLORS = ["#c98a5f", "#c4a574", "#eceae4"];

  function fireworks(n) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = document.createElement("div");
    host.className = "burst";
    host.style.left = innerWidth / 2 + "px";
    host.style.top = innerHeight * 0.35 + "px";
    for (let i = 0; i < (n || 26); i++) {
      const sp = document.createElement("i");
      sp.className = "spark";
      const a = Math.random() * Math.PI * 2;
      const d = 60 + Math.random() * 130;
      sp.style.setProperty("--dx", Math.cos(a) * d + "px");
      sp.style.setProperty("--dy", Math.sin(a) * d + 40 + "px");
      sp.style.background = SPARK_COLORS[i % SPARK_COLORS.length];
      sp.style.animationDelay = Math.random() * 120 + "ms";
      host.appendChild(sp);
    }
    document.body.appendChild(host);
    setTimeout(() => host.remove(), 1500);
  }

  /** 0 = pre-flight (no clock). Day 1 begins when the bank account opens. */
  function dayOf(state) {
    if (!state.clockStartedAt) return 0;
    const ms = Date.now() - new Date(state.clockStartedAt).getTime();
    return Math.max(1, Math.min(30, Math.floor(ms / 86400000) + 1));
  }

  function domainFrom(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24) || "yourllc";
  }

  function napBlock(c) {
    return [
      c.legalName,
      c.dba ? `DBA ${c.dba}` : null,
      c.street,
      `${c.city}, ${c.state} ${c.zip}`,
      c.phone || "(add phone)",
      c.email || "(add email)",
      c.website || `https://${domainFrom(c.legalName)}.com`,
      c.ein ? `EIN ${c.ein}` : "EIN: apply free at IRS.gov",
      `NAICS ${c.naics || "(set industry)"}`,
      c.formationDate ? `Formed ${c.formationDate} · ${c.state} LLC` : `${c.state} LLC`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  function operatingAgreement(c, signer) {
    const member = signer?.fullName || "the sole member";
    return `SINGLE-MEMBER OPERATING AGREEMENT
${c.legalName}

This Operating Agreement is adopted as of ${c.formationDate || "____"} by ${member}, the sole member of ${c.legalName}, a ${c.state} LLC.

1. Name. The name of the company is ${c.legalName}${c.dba ? ` (DBA ${c.dba})` : ""}.

2. Principal office. ${c.street}, ${c.city}, ${c.state} ${c.zip}.

3. Purpose. The company may engage in lawful business under NAICS ${c.naics}.

4. Member. ${member} owns 100% of the membership interest and may open bank accounts, obtain an EIN, and bind the company to vendor terms.

5. Banking. Operating funds shall be held in accounts titled ${c.legalName}.

This is a working draft generated by Ignition. Have counsel review before relying on it.

${signer?.title || "Member"}: ${member}  Date: ___________
`;
  }

  function vendorPacket(c, signer, vendor) {
    return `NET-30 / TRADE APPLICATION — ${vendor}

Legal name:     ${c.legalName}
DBA:            ${c.dba || "—"}
Entity:         LLC
State filed:    ${c.state}
Formation:      ${c.formationDate || "—"}
EIN:            ${c.ein || "(get free at IRS.gov)"}
NAICS:          ${c.naics || "—"}
Street:         ${c.street}
City / ST ZIP:  ${c.city}, ${c.state} ${c.zip}
Phone:          ${c.phone || "(add phone)"}
Email:          ${c.email || "(add email)"}
Signer:         ${signer ? `${signer.fullName}, ${signer.title}` : "Managing Member"}

Paste this block. Do not change spelling or LLC vs L.L.C.
Pay the invoice from the business account the day it lands.
`;
  }

  // Which auto tasks produce which packet the day they run.
  const AUTO_PACKETS = {
    nap: (s) => "CANONICAL NAP — use this string everywhere\n\n" + napBlock(s.company),
    oa: (s) => operatingAgreement(s.company, s.signer),
    site: (s) =>
      `ONE-PAGE WEBSITE COPY — ${s.company.legalName}\n\nHeadline: ${s.company.legalName}\nSubhead: ${INDUSTRIES.find((i) => i.id === s.company.industry)?.label || "Professional services"} in ${s.company.city || "your city"}, ${s.company.state}.\n\nAbout: ${s.company.legalName} is a ${s.company.state}-registered LLC serving commercial customers. Contact us for quotes and terms.\n\nContact block:\n${napBlock(s.company)}\n\nPut this on any one-page host today — the point is that the NAP is findable.`,
    email: (s) =>
      `BUSINESS EMAIL SETUP — ${s.company.legalName}\n\nMailbox: hello@${domainFrom(s.company.legalName)}.com\nUse it on every application. Free tiers of business mail work.\nNo gmail/yahoo on credit applications — vendors score it.`,
    duns: (s) =>
      `DUNS REQUEST — Dun & Bradstreet (FREE — never pay a reseller)\n\n${vendorPacket(s.company, s.signer, "D-U-N-S (Dun & Bradstreet)")}\nOfficial: https://www.dnb.com/duns-number/get-a-duns.html\nExpect 2–4 weeks. Vendor lines do not wait for it.`,
    v1: (s) => vendorPacket(s.company, s.signer, "Uline"),
    v2: (s) => vendorPacket(s.company, s.signer, "Quill"),
    v3: (s) => vendorPacket(s.company, s.signer, "Grainger"),
    audit: (s) => {
      const g = guaranteeState(s);
      return `DAY-30 FILE AUDIT — ${s.company.legalName}\n\nSteps complete: ${g.done}/${g.total}\nCredit line confirmed: ${s.done.firstline ? "YES" : "not marked"}\n\n${g.met ? "Guarantee MET: your LLC has open credit. Keep paying invoices on time — that is what builds the file from here." : g.missed.length ? "Steps missed: " + g.missed.join(", ") + ". The guarantee requires every step on schedule." : "All steps done but no credit line marked. Email " + MAIL + " within 14 days — refund window is open."}`;
    },
  };

  function guaranteeState(s) {
    const total = PLAN.length;
    const done = PLAN.filter((t) => s.done[t.id]).length;
    const day = dayOf(s);
    const missed = PLAN.filter((t) => t.kind === "human" && !t.outcome && !s.done[t.id] && t.day > 0 && day > t.day + 2).map((t) => t.title);
    const met = !!s.done.firstline;
    return { total, done, day, missed, met, onTrack: !missed.length };
  }

  function defaultState(company, signer) {
    return {
      company,
      signer,
      startedAt: new Date().toISOString(),
      clockStartedAt: null,
      pro: false,
      done: {},
      lastPacket: "",
      hermesLog: [],
      runLog: [{ at: new Date().toISOString(), title: "Sprint opened", note: "Pre-flight first — your 30 days start when the bank account opens." }],
    };
  }

  /* ---------- Just-in-time fields ---------- */
  const FIELDS = {
    street: { label: "Street address", placeholder: "1806 Commerce St", auto: "address-line1" },
    city: { label: "City", placeholder: "Dallas", auto: "address-level2" },
    zip: { label: "ZIP", placeholder: "75201", auto: "postal-code" },
    formationDate: { label: "Formation date", type: "date" },
    industry: { label: "Industry", options: INDUSTRIES },
  };

  const NEEDS_ADDRESS = ["street", "city", "zip", "formationDate", "industry"];

  function ensureFields(keys, company) {
    const missing = keys.filter((k) => !company[k]);
    if (!missing.length) return Promise.resolve(true);

    return new Promise((resolve) => {
      const dlg = document.createElement("dialog");
      dlg.className = "panel";
      dlg.style.cssText = "max-width:26rem;width:calc(100% - 2rem);border:none;padding:1.5rem";
      const form = document.createElement("form");
      form.method = "dialog";
      form.innerHTML =
        '<p class="eyebrow">Finish the file</p>' +
        '<p class="muted" style="margin:0 0 1rem;font-size:0.9rem">The packets need these to be paste-ready. Asked once.</p>' +
        missing
          .map((k) => {
            const f = FIELDS[k];
            const id = "jit-" + k;
            const input = f.options
              ? `<select id="${id}" name="${k}" required>` +
                f.options.map((o) => `<option value="${o.id}">${o.label}</option>`).join("") +
                `</select>`
              : `<input id="${id}" name="${k}" required type="${f.type || "text"}"` +
                (f.auto ? ` autocomplete="${f.auto}"` : "") +
                (f.placeholder ? ` placeholder="${f.placeholder}"` : "") +
                ` />`;
            return `<label for="${id}">${f.label}</label>${input}`;
          })
          .join("") +
        '<div style="display:flex;gap:0.5rem;margin-top:1rem">' +
        '<button class="btn btn-primary" value="ok" type="submit">Continue</button>' +
        '<button class="btn btn-ghost" value="cancel" type="button" data-cancel>Not now</button>' +
        "</div>";
      dlg.appendChild(form);
      document.body.appendChild(dlg);
      form.querySelector("[data-cancel]").addEventListener("click", () => dlg.close("cancel"));

      dlg.addEventListener("close", () => {
        const ok = dlg.returnValue === "ok";
        if (ok) {
          const fd = new FormData(form);
          missing.forEach((k) => {
            const v = String(fd.get(k) || "").trim();
            if (k === "industry") {
              const ind = INDUSTRIES.find((i) => i.id === v) || INDUSTRIES[0];
              company.industry = ind.id;
              company.naics = ind.naics;
            } else {
              company[k] = v;
            }
          });
        }
        dlg.remove();
        resolve(ok);
      });

      dlg.showModal();
    });
  }

  /* ---------- Setup page ---------- */
  function initSetup() {
    const stateSel = document.getElementById("state");
    if (stateSel) {
      STATES.forEach((st) => {
        const o = document.createElement("option");
        o.value = st;
        o.textContent = st;
        stateSel.appendChild(o);
      });
      const hinted = (new URLSearchParams(location.search).get("state") || "").toUpperCase();
      stateSel.value = STATES.includes(hinted) ? hinted : "TX";
    }
    const form = document.getElementById("intake");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const company = {
        legalName: String(fd.get("legalName") || "").trim(),
        dba: "", state: String(fd.get("state")), formationDate: "",
        street: "", city: "", zip: "", phone: "", email: "", website: "",
        ein: "", industry: "", naics: "",
      };
      const signer = {
        fullName: String(fd.get("signerName") || "").trim(),
        email: String(fd.get("signerEmail") || "").trim(),
        title: "Managing Member",
        attestedAt: new Date().toISOString(),
        attestedTo: "authorized to act for this LLC; Ignition drafts only",
      };
      if (!company.legalName || !signer.fullName || !signer.email) {
        toast("LLC name, your name, and email are required.");
        return;
      }
      save(defaultState(company, signer));
      location.href = "desk.html";
    });
  }

  /* ---------- Desk ---------- */
  function initDesk() {
    if (!document.getElementById("co-name")) return;
    let state = load();
    if (!state?.company) {
      location.href = "setup.html";
      return;
    }

    const $ = (id) => document.getElementById(id);

    function escapeHtml(t) {
      return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Auto tasks fire when their day arrives. Free preview covers days 1–3.
    function runAutoTasks() {
      const day = dayOf(state);
      const limit = state.pro ? day : Math.min(day, 1);
      let ran = 0;
      PLAN.forEach((t) => {
        if (t.kind !== "auto" || t.day > limit || state.done[t.id]) return;
        state.done[t.id] = new Date().toISOString();
        const packet = AUTO_PACKETS[t.id]?.(state);
        if (packet) state.lastPacket = packet;
        state.runLog.unshift({ at: new Date().toISOString(), title: "Desk ran: " + t.title, note: t.note });
        ran += 1;
      });
      if (ran) save(state);
      return ran;
    }

    function render() {
      const c = state.company;
      const day = dayOf(state);
      const g = guaranteeState(state);
      const pct = Math.round((g.done / g.total) * 100);

      $("co-name").textContent = c.legalName;
      $("signer-line").textContent = `${state.signer.fullName} · ${state.signer.title}`;
      $("day-line").textContent = day === 0 ? "Pre-flight — the 30 days start when your bank account opens" : `Day ${day} of 30 — clock started at bank open`;
      $("score-num").textContent = `${g.done}/${g.total}`;
      $("score-pct").textContent = `${pct}%`;
      $("progress").style.width = `${pct}%`;

      const bill = window.IgnitionBilling?.get() || { pro: false };
      state.pro = bill.pro;
      $("plan-badge").textContent = bill.pro ? "Sprint Pass" : "Preview";
      const upgrade = $("upgrade-pass");
      const manage = $("manage-billing");
      if (upgrade) upgrade.hidden = bill.pro;
      if (manage) manage.hidden = !window.IgnitionBilling?.hasAccount();

      // Guarantee panel
      const gp = $("guarantee");
      if (g.met) {
        gp.innerHTML = `<strong class="sage">Guarantee met.</strong> Your LLC has open credit. Keep paying on time — that's what builds the file.`;
      } else if (day >= 30 && g.onTrack) {
        gp.innerHTML = `<strong class="amber">Refund window open.</strong> Every step done, no line marked. Email <a href="mailto:${MAIL}">${MAIL}</a> within 14 days for a full refund.`;
      } else if (!g.onTrack) {
        gp.innerHTML = `<strong class="amber">Behind schedule.</strong> The guarantee needs every step on time. Overdue: ${g.missed.map(escapeHtml).join(" · ")}`;
      } else if (day === 0) {
        gp.innerHTML = `<strong>Pre-flight.</strong> EIN and bank account first — your 30 days start the moment the bank account opens. Then: an open credit line by day 30, or 100% refund. <a href="terms.html">Exact terms</a>.`;
      } else {
        gp.innerHTML = `<strong>On track.</strong> Finish every step on schedule and your LLC has an open credit line by day 30 of the clock — or 100% refund. <a href="terms.html">Exact terms</a>.`;
      }

      // Phase strip
      const phases = $("phases");
      phases.innerHTML = "";
      PHASES.forEach((p) => {
        const tasksIn = PLAN.filter((t) => t.day <= p.to && (PHASES.find((q) => q.to < p.to && t.day <= q.to) ? false : true));
        const on = day >= p.to || tasksIn.every((t) => state.done[t.id]);
        const span = document.createElement("span");
        span.className = "phase" + (on ? " on" : "");
        span.textContent = p.label;
        phases.appendChild(span);
      });

      // Task list
      const list = $("tasks");
      list.innerHTML = PLAN.map((t) => {
        const done = !!state.done[t.id];
        const locked = !state.pro && t.day > 3;
        const overdue = !done && t.kind === "human" && day > t.day + 2;
        const status = done ? "✓" : locked ? "🔒" : t.kind === "auto" ? "auto" : t.day === 0 ? "pre" : `day ${t.day}`;
        const showTitle = locked ? "Locked — Sprint Pass" : t.title;
        const showNote = locked ? "Vendor packets and the dated list unlock with the Pass." : t.note;
        return `<li style="display:flex;gap:0.75rem;align-items:flex-start;padding:0.5rem 0;border-bottom:1px solid var(--border)${done ? ";opacity:0.55" : ""}">
          <span class="mono" style="min-width:3.4rem;font-size:0.75rem;${overdue ? "color:var(--danger)" : "color:var(--muted)"}">${status}</span>
          <span style="flex:1">
            <strong>${escapeHtml(showTitle)}</strong>
            <span class="muted" style="display:block;font-size:0.85rem">${escapeHtml(showNote)}${!locked && t.href ? ` <a href="${t.href}" target="_blank" rel="noopener">Open →</a>` : ""}</span>
          </span>
          ${t.kind === "human" && !done && !locked ? `<button type="button" class="btn btn-sm btn-outline" data-check="${t.id}">Done</button>` : ""}
        </li>`;
      }).join("");

      list.querySelectorAll("[data-check]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-check");
          const t = PLAN.find((x) => x.id === id);
          state.done[id] = new Date().toISOString();
          if (id === "bank" && !state.clockStartedAt) {
            state.clockStartedAt = new Date().toISOString();
            state.runLog.unshift({ at: new Date().toISOString(), title: "The 30 days start now", note: "Bank account open — day 1 of 30." });
            toast("Bank account open. Day 1 of 30 starts now.");
          }
          state.runLog.unshift({ at: new Date().toISOString(), title: t.title, note: "Marked done by you." });
          save(state);
          fireworks(id === "firstline" ? 40 : 20);
          if (id === "firstline") toast("Credit line confirmed — guarantee met.");
          render();
        });
      });

      const log = $("activity");
      log.innerHTML = state.runLog
        .slice(0, 8)
        .map((e) => `<li><strong>${escapeHtml(e.title)}</strong><div class="muted" style="font-size:0.85rem">${escapeHtml(e.note)}</div></li>`)
        .join("");

      const hermes = $("hermes-log");
      hermes.innerHTML = state.hermesLog.length
        ? state.hermesLog
            .map((m) => `<div><div class="who">${m.role === "user" ? "You" : "Hermes"}</div><div class="msg">${escapeHtml(m.text)}</div></div>`)
            .join("")
        : `<div class="muted">Ask for any packet from your sprint — NAP, operating agreement, vendor apps, the audit.</div>`;
    }

    const HERMES = {
      "Copy my NAP block": (s) => { s.lastPacket = AUTO_PACKETS.nap(s); return s.lastPacket; },
      "Draft my operating agreement": (s) => { s.lastPacket = AUTO_PACKETS.oa(s); return s.lastPacket; },
      "Uline application": (s) => { s.lastPacket = AUTO_PACKETS.v1(s); return s.lastPacket; },
      "Quill application": (s) => { s.lastPacket = AUTO_PACKETS.v2(s); return s.lastPacket; },
      "Grainger application": (s) => { s.lastPacket = AUTO_PACKETS.v3(s); return s.lastPacket; },
      "DUNS packet": (s) => { s.lastPacket = AUTO_PACKETS.duns(s); return s.lastPacket; },
      "What's due today": (s) => {
        const day = dayOf(s);
        const due = PLAN.filter((t) => !s.done[t.id] && t.day <= day);
        return due.length
          ? "Due now:\n\n" + due.map((t) => `· ${t.day === 0 ? "Pre-flight" : "Day " + t.day} — ${t.title}`).join("\n")
          : "Nothing due. You're ahead of the sprint.";
      },
      "How the guarantee works": () =>
        "The clock starts the day your business bank account opens. Do every step on schedule and your LLC has at least one open credit line (net-30 trade terms count — that's real credit) within 30 days of that, or 100% refund of the Sprint Pass. Nothing approved by day 20? Email " + MAIL + " and we work the file free. We never guarantee a bank loan — nobody honestly can.",
      "What scams should I avoid": () =>
        "Walk away from: paid EIN mills, DUNS resellers, seasoned tradelines, CPNs, guaranteed bank approvals, and merchant cash advances. IRS.gov and dnb.com are free.",
      "Run the file audit": (s) => { s.lastPacket = AUTO_PACKETS.audit(s); return s.lastPacket; },
    };

    const PACKET_NEEDS = {
      "Copy my NAP block": ["street", "city", "zip"],
      "Draft my operating agreement": NEEDS_ADDRESS,
      "Uline application": NEEDS_ADDRESS,
      "Quill application": NEEDS_ADDRESS,
      "Grainger application": NEEDS_ADDRESS,
      "DUNS packet": NEEDS_ADDRESS,
    };

    async function askHermes(q) {
      const freeOnly = ["What's due today", "How the guarantee works", "What scams should I avoid"];
      if (!state.pro && !freeOnly.includes(q)) {
        state.hermesLog.push({ role: "user", text: q });
        state.hermesLog.push({
          role: "hermes",
          text: "That's a Sprint Pass packet.\n\nThe preview covers days 1–3 and guidance. The Sprint Pass ($149 one-time) unlocks all 30 days, every packet, and the credit line guarantee.",
        });
        save(state);
        render();
        return;
      }
      const need = PACKET_NEEDS[q];
      if (need && !(await ensureFields(need, state.company))) return;

      const fn = HERMES[q];
      const reply = fn ? fn(state) : "Try a chip — packets, the audit, or what's due today.";
      state.hermesLog.push({ role: "user", text: q });
      state.hermesLog.push({ role: "hermes", text: reply });
      if (state.hermesLog.length > 40) state.hermesLog = state.hermesLog.slice(-40);
      state.runLog.unshift({ at: new Date().toISOString(), title: "Hermes", note: q });
      save(state);
      render();
      if (state.lastPacket && state.pro) {
        navigator.clipboard?.writeText(state.lastPacket).then(
          () => toast("Packet on clipboard."),
          () => {}
        );
      }
    }

    document.querySelectorAll("[data-hermes]").forEach((btn) => {
      btn.addEventListener("click", () => askHermes(btn.getAttribute("data-hermes")));
    });

    $("upgrade-pass")?.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      toast("Opening secure checkout…");
      window.IgnitionBilling.upgrade("sprint_pass").catch((err) => {
        btn.disabled = false;
        toast("Checkout unavailable: " + err.message);
      });
    });

    $("manage-billing")?.addEventListener("click", (e) => {
      const btn = e.currentTarget;
      btn.disabled = true;
      window.IgnitionBilling.manage().catch((err) => {
        btn.disabled = false;
        toast("Billing portal unavailable: " + err.message);
      });
    });

    $("reset")?.addEventListener("click", () => {
      if (confirm("Clear this sprint from this browser?")) {
        localStorage.removeItem(STORAGE);
        location.href = "index.html";
      }
    });

    runAutoTasks();
    render();
    if (!state.welcomed) {
      state.welcomed = true;
      save(state);
      fireworks(34);
      toast("Sprint's open. Day 1 of 30 — the desk already started.");
    }
    document.addEventListener("ignition:billing", () => {
      runAutoTasks();
      render();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSetup();
    initDesk();
    window.IgnitionBilling?.init().then(() => {
      document.dispatchEvent(new Event("ignition:billing"));
    });
  });
})();
