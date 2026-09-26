/* ==========================================================
   Aravind Vasudevan — aravindvas.com
   Mode toggle + theme toggle. The head script already set both
   before paint, so this only wires interaction and keeps the
   URL shareable.
   ========================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var VIEWS = ["professional", "personal"];

  /* ---------- view ---------- */

  var buttons = Array.prototype.slice.call(document.querySelectorAll(".toggle-option"));

  function setView(view, push) {
    if (VIEWS.indexOf(view) === -1) view = "professional";
    root.dataset.mode = view;
    root.dataset.view = view;

    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.mode === view));
    });

    try {
      var url = new URL(window.location.href);
      if (view === "personal") url.searchParams.set("view", "personal");
      else url.searchParams.delete("view");
      if (push) history.pushState({ view: view }, "", url);
    } catch (e) { /* file:// or no history — tabs still work */ }
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { setView(b.dataset.mode, true); });
  });

  window.addEventListener("popstate", function () {
    var v = new URLSearchParams(window.location.search).get("view");
    setView(v === "personal" ? "personal" : "professional", false);
  });

  setView(root.dataset.view, false);

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
      document.body.classList.toggle("theme-light", next === "light");
      document.body.classList.toggle("theme-dark", next === "dark");
      try { localStorage.setItem("av-theme", next); } catch (e) {}
      labelTheme();
    });
  }

  labelTheme();

  /* ---------- the flip card is also a link target on touch ---------- */

  var flip = document.querySelector(".flip");
  if (flip) {
    flip.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); }
    });
  }

})();
