/* ==========================================================
   Aravind Vasudevan — aravindvas.com
   Tab switching only. The page is fully readable without JS:
   the inline head script sets the view, and both panels are
   in the DOM. This just wires the links and keeps the URL honest.
   ========================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".view"));

  function apply(view) {
    if (view !== "pro" && view !== "personal") view = "personal";
    root.dataset.view = view;

    panels.forEach(function (p) {
      p.hidden = p.dataset.panel !== view;
    });

    tabs.forEach(function (t) {
      if (t.dataset.view === view) t.setAttribute("aria-current", "page");
      else t.removeAttribute("aria-current");
    });

    document.title = view === "pro"
      ? "Aravind Vasudevan — Product"
      : "Aravind Vasudevan";
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      var view = tab.dataset.view;

      // Keep the address bar in sync so the view is linkable and
      // survives a refresh or a shared URL.
      var url = new URL(window.location.href);
      url.searchParams.set("view", view);
      history.pushState({ view: view }, "", url);

      apply(view);
    });
  });

  window.addEventListener("popstate", function () {
    var v = new URLSearchParams(window.location.search).get("view");
    apply(v);
  });

  // Normalise the initial state (the head script already set it).
  apply(root.dataset.view);

})();
