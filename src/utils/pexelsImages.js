/**
 * Pexels Image Service
 *
 * Fetches real food photographs from the Pexels API based on meal name
 * and description. Includes an in-memory cache backed by localStorage
 * so images persist across page reloads, and a prefetch function to
 * eagerly load images for visible meals.
 *
 * Requires VITE_PEXELS_API_KEY in your .env file.
 */

const PEXELS_BASE = "https://api.pexels.com/v1/search";
const API_KEY = import.meta.env.VITE_PEXELS_API_KEY || "";
const CACHE_KEY = "mealy_food_images";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── Persistent Cache ───────────────────────────────────────────────────────

const cache = new Map();

/** Load cached entries from localStorage on startup. */
function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const entries = JSON.parse(raw);
    const now = Date.now();
    for (const [key, value] of Object.entries(entries)) {
      // Skip expired entries
      if (value.ts && now - value.ts > CACHE_TTL_MS) continue;
      cache.set(key, value.url);
    }
  } catch {
    // Corrupted storage — start fresh
  }
}

/** Persist the in-memory cache to localStorage (debounced). */
let saveTimer = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      const obj = {};
      for (const [key, url] of cache.entries()) {
        obj[key] = { url, ts: Date.now() };
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
    } catch {
      // Storage full or unavailable — silently skip
    }
  }, 300);
}

// Load on module init
loadCache();

// ── Request Queue ──────────────────────────────────────────────────────────

let inflight = 0;
const MAX_CONCURRENT = 3;
const pendingQueue = [];

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    const run = () => {
      inflight++;
      fn()
        .then(resolve, reject)
        .finally(() => {
          inflight--;
          if (pendingQueue.length > 0) {
            pendingQueue.shift()();
          }
        });
    };
    if (inflight < MAX_CONCURRENT) {
      run();
    } else {
      pendingQueue.push(run);
    }
  });
}

// ── Keyword Extraction ─────────────────────────────────────────────────────

/**
 * Extract the best search keywords from a meal name and description.
 * Prioritises specific food terms over generic ones.
 */
function extractKeywords(name, description) {
  const text = `${name || ""} ${description || ""}`.toLowerCase();

  // Ordered from most to least specific, since the first match wins —
  // a compound dish (e.g. "Grilled Chicken Pasta", "Chicken Wrap") needs
  // its actual dish/carb type checked before a generic single-ingredient
  // pattern like "chicken" swallows it and returns a plain-chicken photo.
  const keywordMap = [
    // Kenyan staples
    [/\bugali\b/, "ugali african food"],
    [/\bsukuma\s*wiki\b/, "sauteed kale greens"],
    [/\bnyama\s*choma\b/, "nyama choma grilled meat kenyan"],
    [/\bpilau\b/, "pilau spiced rice dish"],
    [/\bbiryani\b/, "biryani rice"],
    [/\bjollof\s*rice\b/, "jollof rice west african"],
    [/\bchapati\b/, "chapati flatbread african"],
    [/\bmandazi\b/, "mandazi african doughnut"],
    [/\bmatoke\b/, "cooked plantains dish"],
    [/\bgitheri\b/, "githeri beans corn kenyan"],
    [/\birio\b/, "irio mashed food kenyan"],
    [/\bmukimo\b/, "mukimo mashed greens kenyan"],
    [/\bkaranga\b/, "karanga beef stew kenyan"],
    [/\bchoma\b/, "grilled meat african"],
    [/\bsamosa\b/, "samosa fried pastry"],
    [/\bmahamri\b/, "mahamri swahili doughnut"],

    // Breakfast dishes (checked before generic "egg"/protein matches)
    [/\bfrench\s*toast\b/, "french toast syrup breakfast"],
    [/\bpancake/, "pancakes stack maple syrup"],
    [/\bwaffle\b/, "waffles breakfast"],
    [/\bavocado\s*toast\b/, "avocado toast breakfast"],
    [/\bbacon\s+(and\s+)?eggs?\b/, "bacon eggs breakfast"],
    [/\btoast\b/, "toast breakfast plate"],
    [/\bomelett?e?\b/, "omelette eggs breakfast"],
    [/\bburrito\b/, "burrito wrap food"],
    [/\bscrambled\s*egg/, "scrambled eggs breakfast"],
    [/\byogurt\s*parfait\b|\bparfait\b/, "yogurt parfait berries breakfast"],
    [/\begg(s)?\b/, "eggs breakfast plate"],
    [/\bgranola\b/, "granola bowl breakfast"],
    [/\bporridge\b/, "porridge oats bowl"],

    // Handheld / assembled dishes (checked before generic protein matches)
    [/\bnachos?\b/, "nachos snack food"],
    [/\bwing(s)?\b/, "chicken wings food"],
    [/\bfalafel\b/, "falafel food"],
    [/\bwrap\b/, "wrap sandwich food"],
    [/\bclub\s*sandwich\b/, "club sandwich food"],
    [/\bsandwich\b/, "sandwich food"],
    [/\bburger\b/, "burger food"],
    [/\bmargherita\b/, "margherita pizza food"],
    [/\bpizza\b/, "pizza food"],
    [/\bsushi\b/, "sushi food"],
    [/\btacos?\b/, "taco food"],
    [/\bhummus\b/, "hummus pita food"],
    [/\bstir[\s-]?fry\b/, "stir fry vegetables food"],
    [/\bsweet\s*potato\s*fries?\b/, "sweet potato fries food"],
    [/\bfries\b/, "french fries food"],
    [/\bpopcorn\s*chicken\b/, "popcorn chicken food"],

    // Carbs (checked before generic protein matches, so e.g. a chicken
    // pasta dish matches "pasta" rather than just "chicken")
    [/\bjollof\b/, "jollof rice"],
    [/\bplain\s*rice\b/, "white rice plate"],
    [/\bfried\s*rice\b/, "fried rice asian"],
    [/\bpasta\b/, "pasta dish"],
    [/\bspaghetti\b/, "spaghetti pasta"],
    [/\bnoodle\b/, "noodles bowl"],
    [/\bmacaroni\b/, "macaroni pasta"],
    [/\b(bread|roti|naan)\b/, "flatbread bread"],

    // Compound protein dishes — checked before the generic "curry" pattern
    // just below (and the generic proteins further down), for the same
    // reason as the sections above: "Butter Chicken" needs to match here,
    // not fall into plain "curry" or plain "chicken"
    [/\bbutter\s*chicken\b/, "butter chicken curry"],
    [/\btikka\b/, "tikka chicken"],
    [/\bkorma\b/, "korma curry"],
    [/\bmasala\b/, "masala dish spiced"],
    [/\bkeema\b/, "keema minced meat"],

    // Prepared savoury dishes (also before generic protein matches)
    [/\bsoup\b/, "soup bowl hot"],
    [/\bstew\b/, "stew bowl"],
    [/\bcurry\b/, "curry bowl"],
    [/\bbroth\b/, "broth soup"],
    [/\bmashed\b/, "mashed food"],
    [/\bsalad\b/, "fresh salad bowl"],
    [/\bkachumbari\b/, "tomato onion salad african"],

    // Generic proteins — checked last among savoury dishes, since these
    // are the most generic and would otherwise swallow more specific
    // matches above (a "chicken wrap" or "chicken pasta" isn't just
    // "chicken")
    [/\b(beef|nyama)\b/, "beef meat dish"],
    [/\b(chicken|kuku|murgi)\b/, "chicken dish food"],
    [/\bbacon\b/, "bacon strips food"],
    [/\bgoat\b/, "goat meat grilled"],
    [/\b(lamb|mutton)\b/, "lamb meat dish"],
    [/\bsteak\b/, "grilled steak"],
    [/\bkebab\b/, "kebab grilled meat"],

    // Fish dishes — specific species checked before the generic "fish"
    // pattern, so e.g. "Grilled Tilapia ... fish ..." matches "tilapia"
    [/\bsalmon\b/, "grilled salmon"],
    [/\btilapia\b/, "grilled tilapia plate"],
    [/\b(prawn|shrimp)\b/, "prawn shrimp dish"],
    [/\b(fish|samaki)\b/, "fish dish plate"],

    // Vegetables
    [/\bvegetable\b/, "vegetable dish plate"],
    [/\b(spinach|managu)\b/, "spinach greens plate"],
    [/\bcabbage\b/, "cabbage dish"],
    [/\bbroccoli\b/, "broccoli dish"],
    [/\bcarrot\b/, "carrots vegetable"],

    // Drinks (specific combos before the generic "tea"/"juice"/"coffee"
    // they contain)
    [/\biced\s*tea\b|\blemon\s*tea\b/, "iced tea lemon glass"],
    [/\bginger\s*tea\b/, "ginger tea cup hot"],
    [/\bpassion\s*fruit\b/, "passion fruit juice"],
    [/\bwatermelon\b/, "watermelon juice fresh"],
    [/\bmango\b/, "mango juice fresh fruit"],
    [/\bjuice\b/, "fresh juice glass"],
    [/\bsmoothie\b/, "smoothie glass fruit"],
    [/\btea\b/, "tea cup hot"],
    [/\bmocha\b/, "mocha coffee chocolate"],
    [/\bcappuccino|espresso|latte\b/, "cappuccino coffee cup"],
    [/\bcoffee\b/, "coffee cup"],
    [/\bsoda\b/, "cold drink glass"],
    [/\blassi\b/, "lassi yogurt drink"],

    // Desserts & sweets
    [/\benergy\s*bites?\b|\benergy\s*balls?\b/, "energy balls healthy snack"],
    [/\bgranola\s*bar/, "granola bar snack"],
    [/\bcake\b/, "cake dessert"],
    [/\bpie\b/, "pie dessert"],
    [/\bpastry\b/, "pastry dessert"],
    [/\bpudding\b/, "pudding dessert"],
    [/\bice\s*cream\b/, "ice cream dessert"],
    [/\bmousse\b/, "mousse dessert"],
    [/\bbrownie\b/, "brownie chocolate"],
    [/\bcookie\b/, "cookies dessert"],
    [/\b(sweet|dessert)\b/, "dessert sweet food"],
  ];

  for (const [pattern, searchTerm] of keywordMap) {
    if (pattern.test(text)) {
      return searchTerm;
    }
  }

  // Fallback: use the meal name's first meaningful words
  const words = (name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "and", "with", "for", "our", "hot", "new"].includes(w))
    .slice(0, 2)
    .join(" ");

  return words || "food plate meal";
}

// ── Core Fetch ─────────────────────────────────────────────────────────────

/**
 * Fetch a food image URL from Pexels for the given meal name/description.
 * Returns null if no API key is configured or the request fails.
 */
export async function fetchFoodImage(name, description) {
  if (!API_KEY) return null;

  const query = extractKeywords(name, description);

  // Return cached result if available
  if (cache.has(query)) {
    return cache.get(query);
  }

  try {
    const data = await enqueue(() =>
      fetch(`${PEXELS_BASE}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
        headers: {
          Authorization: API_KEY,
        },
      }).then((res) => {
        if (!res.ok) throw new Error(`Pexels API ${res.status}`);
        return res.json();
      })
    );

    const photo = data.photos?.[0];
    if (!photo) return null;

    const url = photo.src?.medium || photo.src?.small || photo.src?.original || null;
    if (url) {
      cache.set(query, url);
      scheduleSave();
    }
    return url;
  } catch {
    return null;
  }
}

// ── Batch Prefetch ─────────────────────────────────────────────────────────

/**
 * Eagerly fetch Pexels images for an array of meals.
 * Skips meals that are already cached. Fires and forgets —
 * call this when the meal list is loaded so images are ready
 * by the time card components mount.
 *
 * @param {Array<{ name: string, description?: string }>} meals
 */
export function prefetchFoodImages(meals) {
  if (!API_KEY || !meals?.length) return;

  for (const meal of meals) {
    if (!meal?.name) continue;
    const query = extractKeywords(meal.name, meal.description);
    if (!cache.has(query)) {
      // Fire-and-forget; result will be cached by fetchFoodImage
      fetchFoodImage(meal.name, meal.description);
    }
  }
}
