/* Meal Planner — drag-and-drop weekly menu canvas.
   State persists to localStorage; export produces the JSON to send back.
   Slots are free-form (any dish, any tile); Cmd/Ctrl-drag copies a placed
   card; click-a-card-then-a-tile picks placement across the whole board;
   custom meals can be added to the deck with partial metadata. */
(function () {
  "use strict";

  const STORE_KEY = "meal-planner-v1";
  const state = load();

  // ── persistence ───────────────────────────────────────────
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE_KEY));
      if (raw && raw.slots) {
        return {
          goals: Object.assign({}, GOALS, raw.goals || {}),
          slots: raw.slots,
          custom: raw.custom || [],
        };
      }
    } catch (e) { /* fall through to defaults */ }
    return {
      goals: Object.assign({}, GOALS),
      slots: JSON.parse(JSON.stringify(DEFAULT_PLAN)),
      custom: [],
    };
  }
  function save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  // ── helpers ───────────────────────────────────────────────
  const $ = (sel, root) => (root || document).querySelector(sel);
  const allMeals = () => (state.custom || []).concat(MEALS);
  const byId = (id) => allMeals().find((m) => m.id === id);
  const cellKey = (day, slot) => day + "-" + slot;
  const pct = (v, goal) => (goal > 0 ? Math.round((v / goal) * 100) : 0);
  const val = (v) => (typeof v === "number" ? v : 0);

  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function macroRows(m) {
    const g = state.goals;
    const rows = [
      ["kcal", val(m.kcal), g.kcal, "kcal"],
      ["protein", val(m.protein), g.protein, "g P"],
      ["carbs", val(m.carbs), g.carbs, "g C"],
      ["fat", val(m.fat), g.fat, "g F"],
      ["fiber", val(m.fiber), g.fiber, "g Fib"],
    ];
    return rows.map(([key, v, goal, unit]) => {
      const p = pct(v, goal);
      return (
        '<div class="macro-row">' +
        '<span class="lbl">' + (key === "kcal" ? "kcal" : key === "fiber" ? "Fib" : key[0].toUpperCase()) + "</span>" +
        '<span class="bar bar-' + key + '"><i style="width:' + Math.min(100, p) + '%"></i></span>' +
        '<span class="pct">' + p + "%</span>" +
        "</div>"
      );
    }).join("");
  }

  // ── grid ──────────────────────────────────────────────────
  function renderGrid() {
    const grid = $("#grid");
    let html = '<div class="grid__corner"></div>';
    DAYS.forEach((d) => (html += '<div class="grid__day">' + d.label + "</div>"));

    SLOTS.forEach((s) => {
      html += '<div class="grid__rowlabel">' + s.label + "</div>";
      DAYS.forEach((d) => {
        const key = cellKey(d.id, s.id);
        const meal = byId(state.slots[key]);
        html += '<div class="cell" data-day="' + d.id + '" data-slot="' + s.id + '" data-key="' + key + '">';
        if (meal) {
          html +=
            '<div class="placed" draggable="true" data-key="' + key + '" data-meal="' + meal.id + '">' +
            '<button class="placed__x" aria-label="Remove ' + meal.name + '">&times;</button>' +
            '<div class="placed__name">' + meal.name + "</div>" +
            '<div class="placed__macros">' + val(meal.kcal) + " kcal · P " + val(meal.protein) +
            " (" + pct(val(meal.protein), state.goals.protein) + "%) · C " + val(meal.carbs) +
            " (" + pct(val(meal.carbs), state.goals.carbs) + "%) · F " + val(meal.fat) +
            " (" + pct(val(meal.fat), state.goals.fat) + "%) · Fib " + val(meal.fiber) +
            " (" + pct(val(meal.fiber), state.goals.fiber) + "%)</div>" +
            "</div>";
        }
        html += "</div>";
      });
    });

    // totals row
    html += '<div class="grid__rowlabel">Totals</div>';
    DAYS.forEach((d) => {
      const sum = dayTotals(d.id);
      const over = sum.kcal > state.goals.kcal * 1.1;
      html +=
        '<div class="cell totals' + (over ? " totals--over" : "") + '">' +
        '<div class="totals__kcal">' + sum.kcal + " kcal · " + pct(sum.kcal, state.goals.kcal) + "%</div>" +
        '<div class="totals__bar bar-protein"><i style="width:' + Math.min(100, pct(sum.protein, state.goals.protein)) + '%"></i></div>' +
        '<div class="totals__m">P ' + sum.protein + " g (" + pct(sum.protein, state.goals.protein) + "%) · C " +
        sum.carbs + " g (" + pct(sum.carbs, state.goals.carbs) + "%) · F " + sum.fat + " g (" + pct(sum.fat, state.goals.fat) + "%) · Fib " +
        sum.fiber + " g (" + pct(sum.fiber, state.goals.fiber) + "%)</div>" +
        "</div>";
    });

    grid.innerHTML = html;
    wireGrid();
    if (pickMealId) $(".grid-wrap").classList.add("picking");
  }

  function dayTotals(dayId) {
    const t = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    SLOTS.forEach((s) => {
      const meal = byId(state.slots[cellKey(dayId, s.id)]);
      if (meal) {
        t.kcal += val(meal.kcal); t.protein += val(meal.protein); t.carbs += val(meal.carbs);
        t.fat += val(meal.fat); t.fiber += val(meal.fiber);
      }
    });
    return t;
  }

  // ── pool ──────────────────────────────────────────────────
  let filterSlot = "all";
  let filterText = "";

  function renderPool() {
    const pool = $("#pool");
    const items = allMeals().filter(
      (m) => (filterSlot === "all" || m.slot === filterSlot) &&
             (!filterText || m.name.toLowerCase().includes(filterText))
    );
    pool.innerHTML = items.map((m) =>
      '<button class="opt" draggable="true" data-meal="' + m.id + '" title="Click to pick a tile · double-click for the first free slot">' +
      '<span class="opt__top"><span class="opt__name">' + m.name + "</span>" +
      '<span class="tag tag--' + m.tag + '">' + m.tag + "</span></span>" +
      '<div class="opt__kcal">' + val(m.kcal) + " kcal · " + val(m.protein) + " P · " + val(m.carbs) + " C · " + val(m.fat) + " F · " + val(m.fiber) + " Fib</div>" +
      macroRows(m) +
      (m.custom ? '<span class="opt__del" data-del="' + m.id + '" title="Remove custom meal">&times;</span>' : "") +
      "</button>"
    ).join("") || '<p class="opt__hint">Nothing matches that filter.</p>';
    wirePool();
  }

  // ── drag & drop + pick placement ──────────────────────────
  let dragData = null;
  let pickMealId = null;

  function startPick(mealId) {
    const meal = byId(mealId);
    if (!meal) return;
    pickMealId = mealId;
    $(".grid-wrap").classList.add("picking");
    toast("Pick a tile for “" + meal.name + "” — Enter = first free slot · Esc = cancel.");
  }
  function endPick() {
    pickMealId = null;
    $(".grid-wrap").classList.remove("picking");
  }

  function wirePool() {
    document.querySelectorAll(".opt").forEach((el) => {
      el.addEventListener("dragstart", (e) => {
        dragData = { mealId: el.dataset.meal, from: "pool" };
        e.dataTransfer.setData("text/plain", el.dataset.meal);
        e.dataTransfer.effectAllowed = "copy";
      });
      el.addEventListener("click", () => startPick(el.dataset.meal));
      el.addEventListener("dblclick", () => { endPick(); autoPlace(el.dataset.meal); });
      const del = $(".opt__del", el);
      if (del) {
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          removeCustom(el.dataset.meal);
        });
      }
    });
  }

  function wireGrid() {
    document.querySelectorAll(".placed").forEach((el) => {
      el.addEventListener("dragstart", (e) => {
        // Cmd / Ctrl / Option held = copy instead of move
        const copy = e.metaKey || e.ctrlKey || e.altKey;
        dragData = { mealId: el.dataset.meal, from: copy ? "copy" : "grid", key: el.dataset.key };
        e.dataTransfer.setData("text/plain", el.dataset.meal);
        e.dataTransfer.effectAllowed = copy ? "copy" : "move";
        e.stopPropagation();
      });
      $(".placed__x", el).addEventListener("click", (e) => {
        e.stopPropagation();
        delete state.slots[el.dataset.key];
        save(); renderGrid();
      });
    });

    document.querySelectorAll(".cell[data-key]").forEach((cell) => {
      cell.addEventListener("dragover", (e) => {
        e.preventDefault();
        cell.classList.add("cell--over");
      });
      cell.addEventListener("dragleave", () => cell.classList.remove("cell--over"));
      cell.addEventListener("drop", (e) => {
        e.preventDefault();
        cell.classList.remove("cell--over");
        if (!dragData) return;
        const meal = byId(dragData.mealId);
        if (!meal) return;
        if (dragData.from === "grid") delete state.slots[dragData.key];
        state.slots[cell.dataset.key] = meal.id;
        save(); renderGrid();
        if (dragData.from === "copy") toast("Copied “" + meal.name + "”.");
        dragData = null;
      });
      cell.addEventListener("click", () => {
        if (!pickMealId) return;
        const meal = byId(pickMealId);
        state.slots[cell.dataset.key] = pickMealId;
        endPick();
        save(); renderGrid();
        if (meal) toast("Placed “" + meal.name + "”.");
      });
    });
  }

  function autoPlace(mealId) {
    const meal = byId(mealId);
    if (!meal) return;
    for (const d of DAYS) {
      const key = cellKey(d.id, meal.slot);
      if (!state.slots[key]) {
        state.slots[key] = meal.id;
        save(); renderGrid();
        toast("Added to " + d.label + " " + meal.slot + ".");
        return;
      }
    }
    for (const s of SLOTS) {
      for (const d of DAYS) {
        const key = cellKey(d.id, s.id);
        if (!state.slots[key]) {
          state.slots[key] = meal.id;
          save(); renderGrid();
          toast("Added to " + d.label + " " + s.label + " (no free " + meal.slot + " slots).");
          return;
        }
      }
    }
    toast("No empty slots left this week.");
  }

  function removeCustom(id) {
    state.custom = state.custom.filter((m) => m.id !== id);
    Object.keys(state.slots).forEach((k) => {
      if (state.slots[k] === id) delete state.slots[k];
    });
    if (pickMealId === id) endPick();
    save(); renderGrid(); renderPool();
    toast("Custom meal removed.");
  }

  // keyboard: Enter = auto-place the picked card, Esc = cancel
  document.addEventListener("keydown", (e) => {
    if (!pickMealId) return;
    if (e.key === "Escape") {
      endPick();
      toast("Cancelled.");
    } else if (e.key === "Enter") {
      const id = pickMealId;
      endPick();
      autoPlace(id);
    }
  });

  // edge auto-scroll while dragging (vertical page + horizontal week)
  document.addEventListener("dragover", (e) => {
    if (!dragData) return;
    const edge = 90;
    if (e.clientY < edge) window.scrollBy(0, -20);
    else if (e.clientY > window.innerHeight - edge) window.scrollBy(0, 20);
    const gw = $(".grid-wrap");
    const r = gw.getBoundingClientRect();
    if (e.clientY >= r.top && e.clientY <= r.bottom) {
      if (e.clientX < r.left + 90) gw.scrollLeft -= 24;
      else if (e.clientX > r.right - 90) gw.scrollLeft += 24;
    }
  });
  document.addEventListener("dragend", () => { dragData = null; });

  // ── custom meals ──────────────────────────────────────────
  const customForm = $("#custom-form");
  $("#custom-toggle").addEventListener("click", () => {
    customForm.hidden = !customForm.hidden;
    if (!customForm.hidden) $("#custom-name").focus();
  });
  $("#custom-cancel").addEventListener("click", () => {
    customForm.hidden = true;
    customForm.reset();
  });
  customForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#custom-name").value.trim();
    if (!name) return;
    const num = (id) => {
      const v = parseFloat($(id).value);
      return isNaN(v) ? 0 : Math.max(0, v);
    };
    const meal = {
      id: "c" + Date.now(),
      name,
      slot: $("#custom-slot").value,
      tag: "custom",
      kcal: num("#custom-kcal"),
      protein: num("#custom-protein"),
      carbs: num("#custom-carbs"),
      fat: num("#custom-fat"),
      fiber: num("#custom-fiber"),
      custom: true,
    };
    state.custom.push(meal);
    save();
    customForm.reset();
    customForm.hidden = true;
    renderPool();
    startPick(meal.id);
  });

  // ── toolbar ───────────────────────────────────────────────
  function renderGoals() {
    ["kcal", "protein", "carbs", "fat", "fiber"].forEach((k) => {
      const input = $("#goal-" + k);
      input.value = state.goals[k];
      input.addEventListener("change", () => {
        const v = parseInt(input.value, 10);
        if (v > 0) { state.goals[k] = v; save(); renderGrid(); renderPool(); }
      });
    });
  }

  $("#btn-reset").addEventListener("click", () => {
    if (confirm("Clear every slot and start the week over?")) {
      endPick();
      state.slots = {}; save(); renderGrid();
    }
  });

  $("#btn-export").addEventListener("click", () => {
    const plan = DAYS.flatMap((d) =>
      SLOTS.map((s) => {
        const meal = byId(state.slots[cellKey(d.id, s.id)]);
        return meal ? { day: d.id, slot: s.id, id: meal.id, name: meal.name, kcal: val(meal.kcal), protein: val(meal.protein), carbs: val(meal.carbs), fat: val(meal.fat), fiber: val(meal.fiber) } : null;
      }).filter(Boolean)
    );
    const out = { exported: new Date().toISOString().slice(0, 10), goals: state.goals, custom: state.custom, plan };
    const json = JSON.stringify(out, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "meal-week-plan.json";
    a.click();
    if (navigator.clipboard) navigator.clipboard.writeText(json).catch(() => {});
    toast("Plan exported (" + plan.length + " meals) — file downloaded, JSON copied.");
  });

  $("#btn-import").addEventListener("click", () => {
    const raw = prompt("Paste exported plan JSON:");
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data.custom)) {
        data.custom.forEach((c) => {
          if (c && c.id && c.name && !byId(c.id)) state.custom.push(Object.assign({ custom: true }, c));
        });
      }
      const slots = {};
      (data.plan || []).forEach((p) => {
        const key = cellKey(p.day, p.slot);
        if (byId(p.id)) slots[key] = p.id;
      });
      state.slots = slots;
      if (data.goals) state.goals = Object.assign({}, GOALS, data.goals);
      save(); renderGrid(); renderGoals(); renderPool();
      toast("Plan imported.");
    } catch (e) {
      toast("That JSON could not be read.");
    }
  });

  // ── starter week ───────────────────────────────────────────
  document.getElementById("btn-starter").addEventListener("click", () => {
    if (!confirm("Replace the current week with the balanced starter?")) return;
    endPick();
    state.slots = JSON.parse(JSON.stringify(DEFAULT_PLAN));
    save(); renderGrid();
    toast("Starter week loaded.");
  });

  // ── scratchpad (sticky note) ───────────────────────────────
  const scratch = document.getElementById("scratch");
  scratch.value = localStorage.getItem("meal-planner-scratch") || "";
  scratch.addEventListener("input", () => localStorage.setItem("meal-planner-scratch", scratch.value));
  document.getElementById("scratch-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(scratch.value);
      toast("Scratchpad copied.");
    } catch (e) {
      scratch.select();
      toast("Text selected — press ⌘C.");
    }
  });
  document.getElementById("scratch-save").addEventListener("click", () => {
    const name = "meal-notes-" + new Date().toISOString().slice(0, 10) + ".md";
    const blob = new Blob([(scratch.value || "(empty)") + "\n"], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    toast("Saved " + name + ".");
  });

  // pool filters
  document.querySelectorAll(".chip[data-slot]").forEach((chip) => {
    chip.addEventListener("click", () => {
      filterSlot = chip.dataset.slot;
      document.querySelectorAll(".chip[data-slot]").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      renderPool();
    });
  });
  $("#pool-search").addEventListener("input", (e) => {
    filterText = e.target.value.trim().toLowerCase();
    renderPool();
  });

  // ── go ────────────────────────────────────────────────────
  renderGoals();
  renderGrid();
  renderPool();
})();
