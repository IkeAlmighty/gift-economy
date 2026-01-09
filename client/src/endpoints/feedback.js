// Submit feedback to the backend
export async function submitFeedback({ type, message, email }) {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, message, email }),
    credentials: "include",
  });
  return res;
}
