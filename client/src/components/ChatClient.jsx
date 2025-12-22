import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function ChatClient({ listingId }) {
  const socketRef = useRef(null);

  const [status, setStatus] = useState("disconnected");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    setStatus("connecting");
    setError("");

    const socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connected");
      socket.emit("joinListingChat", { listingId });
    });
  }, []);
  return (
    <>
      <div className="py-3">Chat Client {listingId}</div>
      {/* Chat client implementation goes here */}
    </>
  );
}
