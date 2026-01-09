// IMPORTANT NOTE: Use the UserContext for logging in and logging out. This code
// is called by the context's respective functions.

// LOGIN/LOGOUT/SIGNUP ROUTES

export async function login({ username, password }) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  return { data, error: data.error };
}

export async function logout() {
  const response = await fetch("/api/auth/logout", { method: "POST" });
  return await response.json();
}

export async function signup({ username, screenName, password }) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, screenName, password }),
  });

  const data = await response.json();

  return { data, error: data.error };
}

// USER RELATED DATA

export async function me() {
  try {
    const response = await fetch("/api/user/me");
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch {
    return null;
  }
}

export async function sendConnectionRequest(username) {
  try {
    const response = await fetch("/api/user/connections", {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function removeConnection(username) {
  try {
    const response = await fetch(`/api/user/connections?username=${username}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function declineConnectionRequest(username) {
  try {
    const response = await fetch(`/api/user/connection-requests?username=${username}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    return response;
  } catch (err) {
    console.log(err);
  }
}

export async function getSafeConnectionDataById(id) {
  try {
    const response = await fetch(`/api/user/connections?_id=${id} `);

    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function getConnections() {
  try {
    const response = await fetch("/api/user/connections");
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.error(err);
  }
}
