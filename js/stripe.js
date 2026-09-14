/**
 * Ignition — Stripe client. Loaded on every page, before sprint.js.
 * Entitlement is never a boolean the browser can flip: we keep the Checkout
 * Session id and re-ask the server. Answers are cached briefly.
 */
(function () {
  const API = "api/stripe.php";
  const KEY = "ignition-billing-v1";
  const RECHECK_MS = 6 * 3600 * 1000;

  function read() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "null") || {};
    } catch {
      return {};
    }
  }

  function write(b) {
    localStorage.setItem(KEY, JSON.stringify(b));
  }

  async function call(params) {
    const res = await fetch(API + "?" + new URLSearchParams(params));
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
  }

  const Billing = {
    get() {
      const b = read();
      return { pro: !!b.pro, status: b.status || "none", plan: b.plan || null };
    },

    isPro() {
      return this.get().pro;
    },

    hasAccount() {
      return !!read().session_id;
    },

    async upgrade(plan) {
      const { url } = await call({ action: "checkout", plan: plan || "sprint_pass" });
      location.href = url;
    },

    /** Stripe-hosted billing portal: receipts, refund requests. */
    async manage() {
      const b = read();
      if (!b.session_id) throw new Error("no purchase on this browser");
      const { url } = await call({ action: "portal", session_id: b.session_id });
      location.href = url;
    },

    async refresh(sessionId) {
      const b = read();
      const id = sessionId || b.session_id;
      if (!id) return this.get();
      const fresh = await call({ action: "verify", session_id: id });
      write({ ...fresh, session_id: id, checked_at: Date.now() });
      return this.get();
    },

    async init() {
      const url = new URL(location.href);
      const returned = url.searchParams.get("checkout");

      if (returned) {
        url.searchParams.delete("checkout");
        history.replaceState({}, "", url);
        try {
          await this.refresh(returned);
        } catch (e) {
          console.error("[ignition] checkout verify failed", e);
        }
        return this.get();
      }

      const b = read();
      if (b.session_id && Date.now() - (b.checked_at || 0) > RECHECK_MS) {
        try {
          await this.refresh();
        } catch (e) {
          // Server unreachable: keep the last known answer rather than
          // locking a paying customer out of their sprint.
          console.error("[ignition] entitlement refresh failed", e);
        }
      }
      return this.get();
    },
  };

  window.IgnitionBilling = Billing;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-checkout]");
    if (!btn) return;
    e.preventDefault();
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Opening secure checkout…";
    Billing.upgrade(btn.dataset.checkout).catch((err) => {
      btn.disabled = false;
      btn.textContent = label;
      alert("Checkout is unavailable right now: " + err.message);
    });
  });
})();
