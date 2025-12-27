import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { copyToClipboard } from "../utils/clipboard.js";
import { toast } from "react-toastify";
import { useUser } from "../Contexts/UserContext.jsx";

export default function ChatClient({ listingId }) {
  const socketRef = useRef(null);

  const { user } = useUser();

  const [status, setStatus] = useState("disconnected");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    setStatus("connecting");
    setError("");

    const socket = io(`${import.meta.env.VITE_SOCKET_SERVER_URL}/chat`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connected");
      socket.emit("join-room", listingId, { userId: user._id });
    });

    socket.on("disconnect", () => {
      setStatus("disconnected");
    });

    socket.on("chat-message", (message) => {
      setMessages((msgs) => [...msgs, message]);
    });

    socket.on("error", (err) => {
      setError(err.message || "An error occurred");
    });
  }, [listingId, user._id]);

  function handleCopyToClipboard() {
    copyToClipboard(window.location.href);
    toast.success("Chat link copied to clipboard!");
  }

  function handleSendMessage(e) {
    e.preventDefault();
    if (text.trim() === "") return;
    socketRef.current.emit("chat-message", { roomId: listingId, text, userId: user._id });
    setText("");
  }

  return (
    <div className="m-3">
      <div className="flex flex-row justify-between items-center text-xs">
        <div>
          <button onClick={handleCopyToClipboard}>Chat Room {listingId} 📋</button>
        </div>
        <span className={`${status === "connected" ? "text-green-500" : "text-red-500"}`}>
          {status}
        </span>
      </div>

      <div className="border rounded p-3 h-96 overflow-y-auto my-2 bg-white">
        {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.user === "You" ? "text-right flex flex-row-reverse gap-x-2" : "text-left"}`}
          >
            <strong>{msg.sender.screenName}</strong> : <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow border rounded-l p-2"
          placeholder="Type your message..."
        />
        <button type="submit" className="border-2 mx-2 rounded-r px-4">
          Send
        </button>
      </form>

      <div>{error && <p className="text-red-500">{error}</p>}</div>
    </div>
  );
}
