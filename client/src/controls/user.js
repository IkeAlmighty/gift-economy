// IMPORTANT NOTE: Use the UserContext for logging in and logging out. This code
// is called by the context's respective functions.

export async function login({ username, password }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  console.log(data);

  return { data, error: data.error };
}

export async function logout() {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  return await response.json();
}

export async function signup() {}

export async function me() {
  try {
    const response = await fetch("/api/auth/me");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (err) {
    return null;
  }
}
