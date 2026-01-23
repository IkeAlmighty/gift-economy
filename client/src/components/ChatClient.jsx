import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { copyToClipboard } from "../utils/clipboard.js";
import { toast } from "react-toastify";
import { useUser } from "../Contexts/UserContext.jsx";

export default function ChatClient({ listingId, className = "h-[calc(100vh-4rem)]" }) {
  const socketRef = useRef(null);

  const { user, loading } = useUser();

  const [status, setStatus] = useState("disconnected");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (loading || !user || !user._id || !listingId) return;
    setStatus("connecting");
    setError("");
    setMessages([]);

    const socketBase = import.meta.env.VITE_SOCKET_SERVER_URL || window.location.origin;
    const socket = io(`${socketBase}/chat`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connected");
      socket.emit("join-room", listingId, { userId: user._id });
    });

    socket.on("connect_error", (err) => {
      setStatus("disconnected");
      setError("Connection error: " + err.message);
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

    // Cleanup function to disconnect socket
    return () => {
      if (socket) socket.disconnect();
    };
  }, [listingId, user, loading]);

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
    <div className={`m-3 ${className}`}>
      <div className="flex flex-row justify-between items-center text-xs">
        <div>
          <button onClick={handleCopyToClipboard}>Chat Room {listingId} 📋</button>
        </div>
        <span className={`${status === "connected" ? "text-green-500" : "text-red-500"}`}>
          {status}
        </span>
      </div>

      <div className="border rounded p-3 h-[calc(100%_-_65px)] overflow-y-auto my-2 bg-white">
        {messages.length === 0 && <p className="text-gray-500">No messages yet.</p>}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.sender.id === user._id ? "text-right flex flex-row-reverse gap-x-2" : "text-left"}`}
          >
            {msg.sender.id !== user._id && <strong>{msg.sender.screenName}: </strong>}
            <span className="relative inline-block mb-2">
              <div>{msg.text}</div>
              {msg.ts && (messages[idx + 1]?.ts - msg.ts > 60000 || !messages[idx + 1]) && (
                <span
                  className={`text-[0.7rem] text-gray-400 w-[100px] absolute top-5 ${msg.sender.id === user._id ? "right-0" : "left-0"}`}
                >
                  {new Date(msg.ts).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </span>
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
