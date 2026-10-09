
const API_URL = "https://campus-complaint-backend-s8rx.onrender.com";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  // Set JSON content type only for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Add authentication token if available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  // Read response safely
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  // Authentication
  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  registerAdmin: (body) =>
    request("/api/auth/register-admin", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // Complaints
  stats: () =>
    request("/api/complaints/stats"),

  mine: () =>
    request("/api/complaints/mine"),

  all: () =>
    request("/api/complaints/all"),

  complaint: (id) =>
    request(`/api/complaints/${id}`),

  createComplaint: (body) =>
    request("/api/complaints", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateStatus: (id, form) =>
    request(`/api/complaints/${id}/status`, {
      method: "PUT",
      body: form,
    }),
};