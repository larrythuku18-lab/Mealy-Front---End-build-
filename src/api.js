/**
 * Centralized API client for communicating with the Mealy backend.
 *
 * Automatically attaches the Authorization header when a token is
 * available and provides typed helper methods for every endpoint.
 */

const API_BASE = "/api";

let _token = null;

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

  const body = await res.json();

  if (!res.ok) {
    const message = body.error || body.message || `Request failed (${res.status})`;
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
  return request("/menus/publish", {
    method: "POST",
    body: JSON.stringify({ mealOptionIds }),
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
