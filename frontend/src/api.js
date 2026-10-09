
const API_URL = "https://campus-complaint-backend-s8rx.onrender.com";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || "Request failed"
    );
  }

  return data;
}

export const api = {

  /* =========================
     AUTH
  ========================= */

  register: (body) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  registerAdmin: (body) =>
    request("/auth/register-admin", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /* =========================
     COMPLAINTS
  ========================= */

  stats: () =>
    request("/complaints/stats"),

  mine: () =>
    request("/complaints/mine"),

  all: () =>
    request("/complaints/all"),

  complaint: (id) =>
    request(`/complaints/${id}`),

  createComplaint: (body) =>
    request("/complaints", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateStatus: (id, form) =>
    request(`/complaints/${id}/status`, {
      method: "PUT",
      body: form,
    }),
};

