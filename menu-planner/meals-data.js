// Meal options pool — Week 1 menu planner.
// Add new recipes by appending to MEALS (keep ids unique). Macros are per
// serving of ARAVIND'S plate (cooked weights where relevant), approx values.
// slot: breakfast | lunch | snack | dinner   ·   tag: veg | egg | chicken
// HOUSEHOLD RULE: meat is CHICKEN ONLY (wife has ichthyophobia — no fish,
// ever, in any form). Everything else is veg or eggs.
// FIBER: wife's gut-health goal — ≥25 g/day. Small boosts are baked into the
// dishes (chickpeas/beans in salads, isabgol in yogurt, side salads, extra
// veg, multigrain/atta over maida) so the default week clears it daily.

const GOALS = { kcal: 1600, protein: 130, carbs: 150, fat: 55, fiber: 25 };

const SLOTS = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "snack", label: "Snack" },
  { id: "dinner", label: "Dinner" },
];

const DAYS = [
  { id: "mon", label: "Mon" }, { id: "tue", label: "Tue" }, { id: "wed", label: "Wed" },
  { id: "thu", label: "Thu" }, { id: "fri", label: "Fri" }, { id: "sat", label: "Sat" },
  { id: "sun", label: "Sun" },
];

// The balanced starter week — seeded on first load ("Load starter week" re-seeds).
// Built around the household's requested recipes (chole/rajma/sambar/palak-dal
// lunches; ragi-mudde/burrito/pasta/pulled-chicken/jowar-paneer dinners).
// Daily balance: ~1,550–1,700 kcal · protein 109–148 g · fiber 25–37 g (goal 25).
// DIGESTION RULE: at most ONE hard-to-digest (bean-heavy: chole/rajma/chana)
// meal per day; the rest of that day stays light. Whey (s19) tops up protein.
const DEFAULT_PLAN = {
  "mon-breakfast": "b16", "mon-lunch": "l22", "mon-snack": "s01", "mon-dinner": "d28",
  "tue-breakfast": "b16", "tue-lunch": "l24", "tue-snack": "s19", "tue-dinner": "d29",
  "wed-breakfast": "b16", "wed-lunch": "l23", "wed-snack": "s19", "wed-dinner": "d32",
  "thu-breakfast": "b16", "thu-lunch": "l25", "thu-snack": "s19", "thu-dinner": "d30",
  "fri-breakfast": "b17", "fri-lunch": "l24", "fri-snack": "s19", "fri-dinner": "d31",
  "sat-breakfast": "b16", "sat-lunch": "l22", "sat-snack": "s04", "sat-dinner": "d28",
  "sun-breakfast": "b19", "sun-lunch": "l25", "sun-snack": "s19", "sun-dinner": "d30",
};

const MEALS = [
  // ── Breakfast ──────────────────────────────────────────────
  { id: "b16", name: "Overnight oats + chia pudding with fruits + whey (25 g)", slot: "breakfast", tag: "veg", kcal: 470, protein: 38, carbs: 55, fat: 12, fiber: 12 },
  { id: "b17", name: "Avocado (guac) on multigrain toast + 2 poached eggs", slot: "breakfast", tag: "egg", kcal: 420, protein: 18, carbs: 28, fat: 22, fiber: 9 },
  { id: "b18", name: "Guac on multigrain toast + fruit", slot: "breakfast", tag: "veg", kcal: 290, protein: 6, carbs: 34, fat: 14, fiber: 8 },
  { id: "b19", name: "Turkish eggs (2 eggs on hung curd, chilli butter) + toast", slot: "breakfast", tag: "egg", kcal: 430, protein: 24, carbs: 27, fat: 23, fiber: 5 },
  { id: "b01", name: "Masala omelette (3 eggs) + multigrain toast", slot: "breakfast", tag: "egg", kcal: 385, protein: 24, carbs: 28, fat: 18, fiber: 3.5 },
  { id: "b02", name: "Moong dal chilla ×2 + mint chutney + 2 eggs", slot: "breakfast", tag: "egg", kcal: 355, protein: 24, carbs: 32, fat: 12, fiber: 6 },
  { id: "b03", name: "Peanut poha 150 g + 2 eggs", slot: "breakfast", tag: "egg", kcal: 415, protein: 20, carbs: 48, fat: 15, fiber: 4 },
  { id: "b04", name: "Besan chilla ×2 + curd 150 g", slot: "breakfast", tag: "veg", kcal: 330, protein: 18, carbs: 30, fat: 14, fiber: 5 },
  { id: "b05", name: "Idli ×2 + sambar + 2 eggs", slot: "breakfast", tag: "egg", kcal: 380, protein: 21, carbs: 48, fat: 9, fiber: 5.5 },
  { id: "b06", name: "Upma 150 g (veg + peanuts) + 2 eggs", slot: "breakfast", tag: "egg", kcal: 400, protein: 19, carbs: 46, fat: 14, fiber: 4.5 },
  { id: "b07", name: "Paneer bhurji 120 g + 1 multigrain toast", slot: "breakfast", tag: "veg", kcal: 375, protein: 25, carbs: 24, fat: 20, fiber: 4.5 },
  { id: "b08", name: "Egg-white omelette (4) + veg + toast", slot: "breakfast", tag: "egg", kcal: 285, protein: 24, carbs: 22, fat: 8, fiber: 3.5 },
  { id: "b09", name: "Ragi dosa + sambar + chutney", slot: "breakfast", tag: "veg", kcal: 350, protein: 12, carbs: 52, fat: 9, fiber: 7 },
  { id: "b10", name: "Greek yogurt 150 g + fruit + 10 almonds", slot: "breakfast", tag: "veg", kcal: 305, protein: 18, carbs: 28, fat: 12, fiber: 4.5 },
  { id: "b11", name: "Sprouts salad 150 g + 2 boiled eggs", slot: "breakfast", tag: "egg", kcal: 315, protein: 22, carbs: 28, fat: 10, fiber: 6.5 },
  { id: "b12", name: "Pesarattu ×2 + upma", slot: "breakfast", tag: "veg", kcal: 385, protein: 15, carbs: 50, fat: 12, fiber: 8 },
  { id: "b13", name: "Vegetable omelette (3 eggs), no toast", slot: "breakfast", tag: "egg", kcal: 285, protein: 21, carbs: 8, fat: 18, fiber: 3 },
  { id: "b14", name: "Grilled chicken sandwich (100 g chicken, multigrain) + side salad", slot: "breakfast", tag: "chicken", kcal: 405, protein: 32, carbs: 33, fat: 12, fiber: 4.5 },
  { id: "b15", name: "Oats idli ×3 + sambar", slot: "breakfast", tag: "veg", kcal: 355, protein: 14, carbs: 52, fat: 9, fiber: 8 },

  // ── Lunch ──────────────────────────────────────────────────
  { id: "l01", name: "Rice 100 g + chicken chettinad 180 g + cabbage poriyal", slot: "lunch", tag: "chicken", kcal: 520, protein: 38, carbs: 45, fat: 16, fiber: 6 },
  { id: "l03", name: "Phulka ×2 + dal chicken keema 180 g + salad", slot: "lunch", tag: "chicken", kcal: 505, protein: 34, carbs: 52, fat: 12, fiber: 8.5 },
  { id: "l04", name: "Curd rice 100 g + chicken sukka 150 g + veg salad", slot: "lunch", tag: "chicken", kcal: 490, protein: 36, carbs: 42, fat: 16, fiber: 6.5 },
  { id: "l05", name: "Rice 100 g + egg curry (2 eggs) + beetroot poriyal", slot: "lunch", tag: "egg", kcal: 470, protein: 22, carbs: 50, fat: 17, fiber: 6.5 },
  { id: "l06", name: "Rajma 200 g + rice 100 g", slot: "lunch", tag: "veg", kcal: 480, protein: 20, carbs: 70, fat: 9, fiber: 9 },
  { id: "l07", name: "Chana masala 200 g + phulka ×2", slot: "lunch", tag: "veg", kcal: 520, protein: 22, carbs: 68, fat: 14, fiber: 12 },
  { id: "l08", name: "Grilled chicken salad (with ¼ cup chickpeas) + 1 toast", slot: "lunch", tag: "chicken", kcal: 450, protein: 42, carbs: 26, fat: 16, fiber: 7.5 },
  { id: "l09", name: "Chicken dum biryani 150 g + veg raita + salad", slot: "lunch", tag: "chicken", kcal: 550, protein: 32, carbs: 58, fat: 18, fiber: 5.5 },
  { id: "l10", name: "Paneer tikka 150 g + salad + 1 phulka", slot: "lunch", tag: "veg", kcal: 485, protein: 28, carbs: 32, fat: 22, fiber: 8 },
  { id: "l11", name: "Sambar rice 150 g + poriyal + 2 eggs", slot: "lunch", tag: "egg", kcal: 475, protein: 22, carbs: 55, fat: 12, fiber: 9.5 },
  { id: "l12", name: "Chicken curry 180 g + phulka ×2 + carrot-cucumber salad", slot: "lunch", tag: "chicken", kcal: 515, protein: 38, carbs: 46, fat: 15, fiber: 7 },
  { id: "l14", name: "Lemon rice 120 g + chicken roast 120 g + beans poriyal", slot: "lunch", tag: "chicken", kcal: 520, protein: 31, carbs: 54, fat: 16, fiber: 6 },
  { id: "l15", name: "Dal tadka 200 g + rice 100 g + curd", slot: "lunch", tag: "veg", kcal: 465, protein: 18, carbs: 62, fat: 11, fiber: 8.5 },
  { id: "l16", name: "Dal 200 g + rice 100 g + beans poriyal", slot: "lunch", tag: "veg", kcal: 470, protein: 19, carbs: 64, fat: 11, fiber: 10.5 },
  { id: "l17", name: "Dal 200 g + phulka ×2 + cabbage poriyal", slot: "lunch", tag: "veg", kcal: 430, protein: 18, carbs: 56, fat: 13, fiber: 10 },
  { id: "l18", name: "Phulka ×2 + aloo gobi + dal fry", slot: "lunch", tag: "veg", kcal: 480, protein: 16, carbs: 62, fat: 16, fiber: 9 },
  { id: "l19", name: "Phulka ×2 + bhindi masala + curd", slot: "lunch", tag: "veg", kcal: 420, protein: 13, carbs: 50, fat: 16, fiber: 8.5 },
  { id: "l20", name: "Phulka ×2 + palak paneer 150 g + salad", slot: "lunch", tag: "veg", kcal: 520, protein: 24, carbs: 38, fat: 27, fiber: 8.5 },
  { id: "l21", name: "Phulka ×2 + kadai paneer 150 g + salad", slot: "lunch", tag: "veg", kcal: 530, protein: 25, carbs: 38, fat: 28, fiber: 7.5 },
  { id: "l22", name: "Chole 150 g + grain (100 g rice / 2 phulka) + veggie + 1 egg", slot: "lunch", tag: "egg", kcal: 500, protein: 22, carbs: 65, fat: 15, fiber: 12.5 },
  { id: "l23", name: "Rajma 150 g + grain (100 g rice / 2 phulka) + veggie + 1 egg", slot: "lunch", tag: "egg", kcal: 500, protein: 22, carbs: 68, fat: 12, fiber: 13 },
  { id: "l24", name: "Sambar + grain (80 g rice / 2 phulka) + poriyal + pepper chicken 150 g", slot: "lunch", tag: "chicken", kcal: 570, protein: 43, carbs: 60, fat: 17, fiber: 11 },
  { id: "l25", name: "Palak/methi dal + grain (80 g rice / 2 phulka) + poriyal + chicken 150 g", slot: "lunch", tag: "chicken", kcal: 590, protein: 46, carbs: 60, fat: 19, fiber: 13 },

  // ── Snack ──────────────────────────────────────────────────
  { id: "s01", name: "Greek yogurt 150 g + ½ apple + 1 tsp isabgol", slot: "snack", tag: "veg", kcal: 150, protein: 12, carbs: 18, fat: 3, fiber: 4.5 },
  { id: "s02", name: "Roasted chana 30 g + buttermilk", slot: "snack", tag: "veg", kcal: 150, protein: 8, carbs: 20, fat: 3, fiber: 5 },
  { id: "s03", name: "10 almonds + green tea", slot: "snack", tag: "veg", kcal: 80, protein: 3, carbs: 3, fat: 7, fiber: 1.5 },
  { id: "s04", name: "Sprouts chaat 150 g", slot: "snack", tag: "veg", kcal: 165, protein: 10, carbs: 22, fat: 3, fiber: 6 },
  { id: "s05", name: "Fruit (apple / guava)", slot: "snack", tag: "veg", kcal: 80, protein: 1, carbs: 20, fat: 0, fiber: 4 },
  { id: "s06", name: "Buttermilk + cucumber sticks", slot: "snack", tag: "veg", kcal: 70, protein: 4, carbs: 7, fat: 2, fiber: 1 },
  { id: "s07", name: "Boiled eggs ×2", slot: "snack", tag: "egg", kcal: 140, protein: 12, carbs: 1, fat: 9, fiber: 0 },
  { id: "s08", name: "Hummus 2 tbsp + veg sticks", slot: "snack", tag: "veg", kcal: 130, protein: 5, carbs: 12, fat: 7, fiber: 4 },
  { id: "s09", name: "Paneer tikka 80 g", slot: "snack", tag: "veg", kcal: 170, protein: 16, carbs: 4, fat: 10, fiber: 1 },
  { id: "s10", name: "Makhana 25 g, roasted", slot: "snack", tag: "veg", kcal: 95, protein: 3, carbs: 15, fat: 2, fiber: 1 },
  { id: "s11", name: "Protein buttermilk shake", slot: "snack", tag: "veg", kcal: 65, protein: 10, carbs: 3, fat: 1, fiber: 0.5 },
  { id: "s12", name: "Peanut chikki 20 g", slot: "snack", tag: "veg", kcal: 100, protein: 3, carbs: 10, fat: 6, fiber: 1 },
  { id: "s13", name: "Veg cutlet ×2 (beans, carrot, peas) + green chutney", slot: "snack", tag: "veg", kcal: 180, protein: 6, carbs: 24, fat: 7, fiber: 4.5 },
  { id: "s14", name: "Chicken cutlet ×2 (veg-studded)", slot: "snack", tag: "chicken", kcal: 220, protein: 16, carbs: 18, fat: 10, fiber: 3 },
  { id: "s15", name: "Creamy tomato soup (blender)", slot: "snack", tag: "veg", kcal: 130, protein: 5, carbs: 16, fat: 5, fiber: 3 },
  { id: "s16", name: "Broccoli soup (blender)", slot: "snack", tag: "veg", kcal: 130, protein: 7, carbs: 12, fat: 6, fiber: 4.5 },
  { id: "s17", name: "Mushroom soup (blender)", slot: "snack", tag: "veg", kcal: 140, protein: 6, carbs: 12, fat: 7, fiber: 2.5 },
  { id: "s18", name: "Dal shorba (blender)", slot: "snack", tag: "veg", kcal: 130, protein: 7, carbs: 16, fat: 4, fiber: 5 },
  { id: "s19", name: "Whey protein shake (1 scoop in water)", slot: "snack", tag: "veg", kcal: 120, protein: 25, carbs: 3, fat: 2, fiber: 0 },

  // ── Dinner ─────────────────────────────────────────────────
  { id: "d01", name: "Paneer bhurji 150 g + 1 phulka + cucumber salad", slot: "dinner", tag: "veg", kcal: 480, protein: 28, carbs: 30, fat: 26, fiber: 8.5 },
  { id: "d02", name: "Chicken stir-fry 180 g + veggies + 1 phulka", slot: "dinner", tag: "chicken", kcal: 465, protein: 40, carbs: 28, fat: 15, fiber: 7.5 },
  { id: "d04", name: "Chicken kebab 150 g + salad + soup", slot: "dinner", tag: "chicken", kcal: 405, protein: 38, carbs: 14, fat: 18, fiber: 5 },
  { id: "d05", name: "Egg curry (2 eggs) + 1 phulka + salad", slot: "dinner", tag: "egg", kcal: 425, protein: 20, carbs: 34, fat: 19, fiber: 8 },
  { id: "d06", name: "Paneer tikka 150 g + sautéed veg", slot: "dinner", tag: "veg", kcal: 420, protein: 28, carbs: 16, fat: 25, fiber: 4.5 },
  { id: "d07", name: "Chicken soup + grilled chicken 120 g + multigrain toast", slot: "dinner", tag: "chicken", kcal: 385, protein: 38, carbs: 24, fat: 10, fiber: 3.5 },
  { id: "d08", name: "Dal 200 g + 1 phulka + curd", slot: "dinner", tag: "veg", kcal: 385, protein: 16, carbs: 46, fat: 12, fiber: 10 },
  { id: "d09", name: "Tandoori chicken 200 g + salad + roasted veg", slot: "dinner", tag: "chicken", kcal: 415, protein: 42, carbs: 10, fat: 18, fiber: 5.5 },
  { id: "d10", name: "Veg khichdi 200 g + curd", slot: "dinner", tag: "veg", kcal: 425, protein: 15, carbs: 58, fat: 12, fiber: 7.5 },
  { id: "d12", name: "Chicken curry 150 g + rice 80 g + beans poriyal", slot: "dinner", tag: "chicken", kcal: 470, protein: 32, carbs: 38, fat: 15, fiber: 5.5 },
  { id: "d13", name: "Egg bhurji (3 eggs) + 1 phulka + salad", slot: "dinner", tag: "egg", kcal: 430, protein: 23, carbs: 28, fat: 22, fiber: 8 },
  { id: "d14", name: "Chicken fried rice 150 g (extra veg)", slot: "dinner", tag: "chicken", kcal: 450, protein: 28, carbs: 55, fat: 13, fiber: 6.5 },
  { id: "d15", name: "Egg fried rice 150 g + sautéed veg", slot: "dinner", tag: "egg", kcal: 430, protein: 21, carbs: 52, fat: 14, fiber: 6 },
  { id: "d16", name: "Chicken pasta, red sauce 150 g + side salad", slot: "dinner", tag: "chicken", kcal: 505, protein: 28, carbs: 60, fat: 15, fiber: 7 },
  { id: "d17", name: "Veg aglio e olio pasta 150 g + salad", slot: "dinner", tag: "veg", kcal: 430, protein: 12, carbs: 58, fat: 14, fiber: 7.5 },
  { id: "d18", name: "Shakshuka (3 eggs) + chicken kebab side + toast", slot: "dinner", tag: "egg", kcal: 520, protein: 47, carbs: 32, fat: 20, fiber: 7.5 },
  { id: "d19", name: "Turkish eggs (2 eggs on hung curd, chilli butter) + grilled chicken 100 g + toast + cucumber-tomato salad", slot: "dinner", tag: "egg", kcal: 540, protein: 50, carbs: 30, fat: 22, fiber: 6 },
  { id: "d20", name: "Chicken shawarma bowl (hummus, salad, pita)", slot: "dinner", tag: "chicken", kcal: 440, protein: 38, carbs: 32, fat: 16, fiber: 8 },
  { id: "d21", name: "Falafel plate + hummus + salad + 1 pita", slot: "dinner", tag: "veg", kcal: 450, protein: 18, carbs: 52, fat: 17, fiber: 11 },
  { id: "d22", name: "Shakshuka (2 eggs) + toast", slot: "dinner", tag: "egg", kcal: 400, protein: 22, carbs: 28, fat: 20, fiber: 6 },
  { id: "d23", name: "Turkish eggs (2 eggs, hung curd, chilli butter) + toast", slot: "dinner", tag: "egg", kcal: 430, protein: 24, carbs: 27, fat: 23, fiber: 5 },
  { id: "d24", name: "Phulka ×2 + mix veg sabzi + dal 150 g", slot: "dinner", tag: "veg", kcal: 420, protein: 15, carbs: 52, fat: 13, fiber: 9.5 },
  { id: "d25", name: "Matar paneer 150 g + 1 phulka + salad", slot: "dinner", tag: "veg", kcal: 460, protein: 24, carbs: 32, fat: 24, fiber: 7.5 },
  { id: "d26", name: "Dal 200 g + rice 80 g + poriyal", slot: "dinner", tag: "veg", kcal: 420, protein: 17, carbs: 58, fat: 10, fiber: 9.5 },
  { id: "d27", name: "Phulka ×2 + bhindi masala + dahi", slot: "dinner", tag: "veg", kcal: 400, protein: 12, carbs: 48, fat: 15, fiber: 8 },
  { id: "d28", name: "Chicken curry 180 g + ragi mudde ×2", slot: "dinner", tag: "chicken", kcal: 530, protein: 43, carbs: 48, fat: 17, fiber: 7 },
  { id: "d29", name: "Chicken burrito bowl (rice, beans, chicken, salsa, veg)", slot: "dinner", tag: "chicken", kcal: 520, protein: 42, carbs: 52, fat: 14, fiber: 10 },
  { id: "d30", name: "Pasta with veggies + grilled chicken 120 g", slot: "dinner", tag: "chicken", kcal: 520, protein: 38, carbs: 52, fat: 14, fiber: 7 },
  { id: "d31", name: "Pulled chicken sandwich with veggies (wholewheat)", slot: "dinner", tag: "chicken", kcal: 440, protein: 38, carbs: 40, fat: 10, fiber: 6 },
  { id: "d32", name: "Jowar roti ×2 + paneer subzi 150 g", slot: "dinner", tag: "veg", kcal: 480, protein: 24, carbs: 44, fat: 22, fiber: 8 },
];
