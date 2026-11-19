(function () {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  var GADS_ID = "AW-16499475514";
  var GTM_ID = "GTM-PZ2P9PPL";

  function loadGoogleAds() {
    if (window.__awcGtagLoaded) return;
    window.__awcGtagLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GADS_ID;
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", GADS_ID);
  }

  function loadGtm() {
    if (window.__awcGtmLoaded) return;
    window.__awcGtmLoaded = true;
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var first = document.getElementsByTagName("script")[0];
    var tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    first.parentNode.insertBefore(tag, first);
  }

  function loadAnalytics() {
    loadGoogleAds();
    loadGtm();
  }

  if (document.readyState === "complete") {
    loadAnalytics();
  } else {
    window.addEventListener("load", loadAnalytics, { once: true });
  }
})();