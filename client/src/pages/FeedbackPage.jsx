import { useState } from "react";
import ToggleButtonGroup from "../components/ToggleButtonGroup";
import { submitFeedback } from "../endpoints/feedback";
import ToolBar from "../components/ToolBar";

export default function FeedbackPage() {
  const [type, setType] = useState("feedback"); // "feedback" or "bug"
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "error"
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await submitFeedback({ type, message, email });
      if (res.ok) {
        setStatus("success");
        setMessage("");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto my-5 px-2 max-w-xl">
      <ToolBar />
      <h1>We need the community's feedback.</h1>
      <h3>Please let us know what we can do better!!!!!!!</h3>

      <form className="my-4 flex flex-col gap-2" onSubmit={handleSubmit}>
        <div>Are you submitting feedback, or a bug?</div>
        <div>
          <ToggleButtonGroup
            value={type === "feedback" ? "left" : "right"}
            onChange={(val) => setType(val === "left" ? "feedback" : "bug")}
            leftLabel="Feedback"
            rightLabel="Bug"
          />
        </div>

        <label className="my-5">
          <div className="my-2">What would you like to share?</div>
          <textarea
            className="w-full border rounded p-2"
            rows={10}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              type === "feedback"
                ? "Share your thoughts, suggestions, or ideas to improve the app."
                : "Describe the bug you encountered, steps to reproduce it, and any other relevant details."
            }
            required
          />
        </label>

        <input
          type="email"
          placeholder="Your email (optional, so we can follow up)"
          className="border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="submit"
          value={loading ? "Submitting..." : "Submit"}
          className="bg-cyan-800 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading}
        />
        {status === "success" && (
          <div className="text-green-700 mt-2">Thank you for your feedback!</div>
        )}
        {status === "error" && (
          <div className="text-red-700 mt-2">
            There was a problem submitting your feedback. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}
