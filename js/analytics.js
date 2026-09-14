/**
 * Ignition — analytics beacon. First-party, cookieless, ~1KB.
 * Sends: pageview on load, plus checkout/intake events. Never sends form
 * values or query strings — only the path, so no customer data leaves here.
 */
(function () {
  var ENDPOINT = "/api/hit.php";

  function send(event) {
    try {
      var q = "?e=" + encodeURIComponent(event) +
              "&p=" + encodeURIComponent(location.pathname) +
              "&r=" + encodeURIComponent(document.referrer || "") +
              "&_=" + Date.now();
      new Image().src = ENDPOINT + q;
    } catch (e) {
      /* analytics must never break the page */
    }
  }

  send("pageview");

  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-checkout], #upgrade-pass")) send("checkout");
  });

  document.addEventListener("submit", function (e) {
    if (e.target.id === "intake") send("intake");
  });
})();
