const API = "http://localhost:5000/api/auth";

export async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Login failed");
  }

  localStorage.setItem("bb_token", data.token);
  localStorage.setItem("bb_user", JSON.stringify(data.user));

  return data.user;
}

export async function register(user) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data.user;
}

export function logout() {
  localStorage.removeItem("bb_token");
  localStorage.removeItem("bb_user");
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("bb_user"));
  } catch {
    return null;
  }
}