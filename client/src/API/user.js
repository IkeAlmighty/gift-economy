export async function login(credentials) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function logout() {}

export async function signup() {}
