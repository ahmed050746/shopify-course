(function () {
  var DESKTOP_MQ = window.matchMedia("(min-width: 900px)");
  var HERO_SRC = "assets/desktop-hero/hero.js?v=20261119perf";

  function loadDesktopHero() {
    if (!DESKTOP_MQ.matches || document.getElementById("desktop-hero-root") == null) return;
    if (document.querySelector('script[data-awc-hero="1"]')) return;
    var script = document.createElement("script");
    script.type = "module";
    script.src = HERO_SRC;
    script.dataset.awcHero = "1";
    document.body.appendChild(script);
  }

  if (DESKTOP_MQ.matches) {
    loadDesktopHero();
  } else if (typeof DESKTOP_MQ.addEventListener === "function") {
    DESKTOP_MQ.addEventListener("change", function (event) {
      if (event.matches) loadDesktopHero();
    });
  } else if (typeof DESKTOP_MQ.addListener === "function") {
    DESKTOP_MQ.addListener(function (event) {
      if (event.matches) loadDesktopHero();
    });
  }
})();