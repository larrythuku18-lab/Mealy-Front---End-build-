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

  const keywordMap = [
    // Kenyan staples
    [/\bugali\b/, "ugali african food"],
    [/\bsukuma\s*wiki\b/, "sukuma wiki kale greens african"],
    [/\bnyama\s*choma\b/, "nyama choma grilled meat kenyan"],
    [/\bpilau\b/, "pilau rice african spiced"],
    [/\bbiryani\b/, "biryani rice"],
    [/\bjollof\s*rice\b/, "jollof rice west african"],
    [/\bchapati\b/, "chapati flatbread african"],
    [/\bmandazi\b/, "mandazi african doughnut"],
    [/\bmatoke\b/, "matoke plantain east african"],
    [/\bgitheri\b/, "githeri beans corn kenyan"],
    [/\birio\b/, "irio mashed food kenyan"],
    [/\bmukimo\b/, "mukimo mashed greens kenyan"],
    [/\bkaranga\b/, "karanga beef stew kenyan"],
    [/\bchoma\b/, "grilled meat african"],
    [/\bsamosa\b/, "samosa fried pastry"],
    [/\bmahamri\b/, "mahamri swahili doughnut"],

    // Rice dishes
    [/\bjollof\b/, "jollof rice"],
    [/\bplain\s*rice\b/, "white rice plate"],
    [/\bfried\s*rice\b/, "fried rice asian"],

    // Meat dishes
    [/\b(beef|nyama)\b/, "beef meat dish"],
    [/\b(chicken|kuku|murgi)\b/, "chicken dish food"],
    [/\bgoat\b/, "goat meat grilled"],
    [/\b(lamb|mutton)\b/, "lamb meat dish"],
    [/\bsteak\b/, "grilled steak"],
    [/\bkebab\b/, "kebab grilled meat"],
    [/\bkeema\b/, "keema minced meat"],
    [/\bmasala\b/, "masala dish spiced"],
    [/\btikka\b/, "tikka chicken"],
    [/\bbutter\s*chicken\b/, "butter chicken curry"],
    [/\bkorma\b/, "korma curry"],

    // Fish dishes
    [/\b(fish|samaki)\b/, "fish dish plate"],
    [/\bsalmon\b/, "grilled salmon"],
    [/\btilapia\b/, "tilapia fish"],
    [/\bprawn|shrimp\b/, "prawn shrimp dish"],

    // Soups & stews
    [/\bsoup\b/, "soup bowl hot"],
    [/\bstew\b/, "stew bowl"],
    [/\bcurry\b/, "curry bowl"],
    [/\bbroth\b/, "broth soup"],
    [/\bmashed\b/, "mashed food"],

    // Vegetables
    [/\bvegetable\b/, "vegetable dish plate"],
    [/\b(spinach|managu)\b/, "spinach greens plate"],
    [/\bcabbage\b/, "cabbage dish"],
    [/\bbroccoli\b/, "broccoli dish"],
    [/\bcarrot\b/, "carrots vegetable"],
    [/\bsalad\b/, "fresh salad bowl"],
    [/\bkachumbari\b/, "tomato onion salad african"],

    // Bread & carbs
    [/\b(bread|roti|naan)\b/, "flatbread bread"],
    [/\bpasta\b/, "pasta dish"],
    [/\bspaghetti\b/, "spaghetti pasta"],
    [/\bnoodle\b/, "noodles bowl"],
    [/\bmacaroni\b/, "macaroni pasta"],

    // Drinks
    [/\bjuice\b/, "fresh juice glass"],
    [/\bsmoothie\b/, "smoothie glass"],
    [/\btea\b/, "tea cup hot"],
    [/\bcoffee\b/, "coffee cup"],
    [/\bsoda\b/, "cold drink glass"],
    [/\blassi\b/, "lassi yogurt drink"],

    // Desserts & sweets
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
