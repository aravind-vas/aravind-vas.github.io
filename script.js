/* ==========================================================
   Aravind Vasudevan — aravindvas.com
   View toggle and theme toggle. The head script has already set
   data-mode and data-theme, so this only wires interaction and
   keeps the URL shareable.
   ========================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var VIEWS = ["professional", "personal"];
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".toggle-option"));

  function setView(view, push) {
    if (VIEWS.indexOf(view) === -1) view = "professional";
    root.dataset.mode = view;

    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-target") === view));
    });

    try {
      var url = new URL(window.location.href);
      if (view === "personal") url.searchParams.set("view", "personal");
      else url.searchParams.delete("view");
      if (push) history.pushState({ view: view }, "", url);
    } catch (e) { /* older browser — the toggle still works */ }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      setView(b.getAttribute("data-target"), true);
    });
  });

  window.addEventListener("popstate", function () {
    var v = new URLSearchParams(window.location.search).get("view");
    setView(v === "personal" ? "personal" : "professional", false);
  });

  setView(root.dataset.mode, false);

  /* ---------- theme ---------- */

  var themeBtn = document.getElementById("themeBtn");

  function labelTheme() {
    if (!themeBtn) return;
    var dark = root.dataset.theme === "dark";
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("av-theme", next); } catch (e) {}
      labelTheme();
    });
  }

  labelTheme();

})();
