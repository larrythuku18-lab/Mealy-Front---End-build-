/**
 * Centralized API client for communicating with the Mealy backend.
 *
 * Automatically attaches the Authorization header when a token is
 * available and provides typed helper methods for every endpoint.
 */

// Strip a trailing slash so `${API_BASE}${path}` (path always starts with
// "/") can't collapse into a double slash — which Vercel/Flask redirect,
// and browsers refuse to follow a redirect on a CORS preflight request.
const rawApiBase = import.meta.env.VITE_API_URL || "/api";
const API_BASE = rawApiBase.endsWith("/") ? rawApiBase.slice(0, -1) : rawApiBase;

export const TOKEN_STORAGE_KEY = "mealy_token";

// Read synchronously at module load (not in a useEffect) so the token is
// already attached to the very first request any provider fires on mount —
// otherwise providers that fetch on mount (e.g. DailyOptionsContext) can run
// before AuthContext's effect restores it, sending an unauthenticated first
// request even for an already-logged-in user reloading the page.
let _token = localStorage.getItem(TOKEN_STORAGE_KEY);

/** Set or clear the auth token used for all subsequent requests. */
export function setToken(token) {
  _token = token;
}

/** Get the current auth token. */
export function getToken() {
  return _token;
}

/**
 * Low-level request helper.
 * Returns the parsed JSON body or throws an Error with the server message.
 */
async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (_token) {
    headers["Authorization"] = `Bearer ${_token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Responses may be empty (e.g. 204) or, if the API host is unreachable
  // or misconfigured, non-JSON (an HTML/plain-text error page). Don't let
  // JSON parsing itself throw an opaque SyntaxError.
  let body = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON or empty body — leave `body` as null.
  }

  if (!res.ok) {
    const message =
      body?.error || body?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return body;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function apiRegister({ name, email, password, phone, role }) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone, role }),
  });
  setToken(data.token);
  return data;
}

export async function apiLogin({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function apiLogout() {
  const data = await request("/auth/logout", { method: "POST" });
  setToken(null);
  return data;
}

export async function apiGetMe() {
  return request("/auth/me");
}

// ─── User Profile ────────────────────────────────────────────────────────────

export async function apiGetProfile() {
  return request("/users/profile");
}

export async function apiUpdateProfile({ name, email, phone, address }) {
  return request("/users/profile", {
    method: "PUT",
    body: JSON.stringify({ name, email, phone, address }),
  });
}

// ─── Meal Options ────────────────────────────────────────────────────────────

export async function apiListMealOptions() {
  return request("/menus/");
}

export async function apiCreateMealOption({ name, description, price, category, image, catererId }) {
  return request("/menus/", {
    method: "POST",
    body: JSON.stringify({ name, description, price, category, image, catererId }),
  });
}

export async function apiUpdateMealOption(id, { name, description, price, category, image, catererId }) {
  return request(`/menus/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, description, price, category, image, catererId }),
  });
}

export async function apiDeleteMealOption(id) {
  return request(`/menus/${id}`, { method: "DELETE" });
}

// ─── Today's Menu ────────────────────────────────────────────────────────────

export async function apiGetTodaysMenu() {
  return request("/menus/today");
}

export async function apiPublishMenu(mealOptionIds) {
  const date = new Date().toISOString().slice(0, 10);
  return request("/menus/publish", {
    method: "POST",
    body: JSON.stringify({ mealOptionIds, date }),
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export async function apiListOrders() {
  return request("/orders/");
}

export async function apiCreateOrder({ mealOptionIds, quantities }) {
  return request("/orders/", {
    method: "POST",
    body: JSON.stringify({ mealOptionIds, quantities }),
  });
}

export async function apiGetOrder(orderId) {
  return request(`/orders/${orderId}`);
}

export async function apiGetTodaysOrders() {
  return request("/orders/today");
}

export async function apiUpdateOrderStatus(orderId, status) {
  return request(`/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export async function apiCreateReview({ meal_option_id, rating, comment }) {
  return request("/reviews/", {
    method: "POST",
    body: JSON.stringify({ meal_option_id, rating, comment }),
  });
}

export async function apiGetReviews(mealOptionId) {
  return request(`/reviews/${mealOptionId}`);
}

// ─── Payments (M-Pesa) ───────────────────────────────────────────────────────

export async function apiInitiateSTKPush({ orderId, phoneNumber }) {
  return request("/payments/stk-push", {
    method: "POST",
    body: JSON.stringify({ order_id: orderId, phone_number: phoneNumber }),
  });
}

export async function apiGetPaymentStatus(paymentId) {
  return request(`/payments/${paymentId}`);
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function apiListCategories() {
  return request("/categories/");
}

export async function apiCreateCategory(name) {
  return request("/categories/", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

// ─── Favorites ───────────────────────────────────────────────────────────────
// NOTE: favorites persist locally (localStorage) so they work without a backend.
// These calls are used opportunistically — if the backend doesn't support them
// yet, the UI silently keeps working from local storage.

export async function apiListFavorites() {
  return request("/favorites/");
}

export async function apiAddFavorite(mealOptionId) {
  return request("/favorites/", {
    method: "POST",
    body: JSON.stringify({ meal_option_id: mealOptionId }),
  });
}

export async function apiRemoveFavorite(mealOptionId) {
  return request(`/favorites/${mealOptionId}`, { method: "DELETE" });
}
