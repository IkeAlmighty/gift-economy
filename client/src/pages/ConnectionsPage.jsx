import { useState, useEffect } from "react";
import { useUser } from "../Contexts/UserContext";
import {
  sendConnectionRequest,
  removeConnection,
  getConnections,
  declineConnectionRequest,
} from "../endpoints/user";
import { toast } from "react-toastify";
import ToolBar from "../components/ToolBar";
import { useModal } from "../Contexts/ModelContext";
import { ConfirmClearModal } from "../components/ConfirmClearModal";
import FloatingBugButton from "../components/FloatingBugButton";

export default function ConnectionsPage() {
  const { user, loading } = useUser();
  const { show } = useModal();
  const [newConnection, setNewConnection] = useState("");
  const [connections, setConnections] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [loadingConnections, setLoadingConnections] = useState(true);

  async function loadConnections() {
    setLoadingConnections(true);
    const data = await getConnections();
    if (data) {
      setConnections(data.connections || []);
      setConnectionRequests(data.connectionRequests || []);
    }
    setLoadingConnections(false);
  }

  useEffect(() => {
    if (user) {
      loadConnections();
    }
  }, [user]);

  async function handleSendConnectionRequest(e) {
    e.preventDefault();
    e.target.disabled = true;
    const res = await sendConnectionRequest(newConnection);
    setNewConnection("");

    if (res.ok) {
      const { message, connectionMade } = await res.json();
      toast(message);
      if (connectionMade) {
        loadConnections();
      }
    } else {
      const { error } = await res.json();
      toast(error);
    }

    e.target.disabled = false;
  }

  async function handleRemoveConnection(connection) {
    const confirmed = await show(ConfirmClearModal, {
      title: "Remove Connection",
      message: `Are you sure you want to remove ${connection.username} from your connections?`,
    });

    if (confirmed) {
      const res = await removeConnection(connection.username);

      if (res.ok) {
        const { message } = await res.json();
        toast(message);
        loadConnections();
      }
    }
  }

  async function handleAcceptRequest(requester) {
    const res = await sendConnectionRequest(requester.username);

    if (res.ok) {
      const { message } = await res.json();
      toast(message);
      loadConnections();
    } else {
      const { error } = await res.json();
      toast(error);
    }
  }

  async function handleDeclineRequest(requester) {
    const res = await declineConnectionRequest(requester.username);

    if (res.ok) {
      const { message } = await res.json();
      toast(message);
      loadConnections();
    } else {
      const { error } = await res.json();
      toast(error);
    }
  }

  if (loading || loadingConnections) return <>...Loading</>;

  return (
    <div>
      <FloatingBugButton />
      <ToolBar />

      <div className="px-2">
        <form className="my-5 [&>*]:mr-2" onSubmit={handleSendConnectionRequest}>
          <label>
            <span>Add a Connection: </span>
            <input
              type="text"
              value={newConnection}
              placeholder="...username"
              onChange={(e) => setNewConnection(e.target.value.trim())}
            />
          </label>
          <input type="submit" value="send request" disabled={newConnection.trim().length === 0} />
        </form>

        {connectionRequests.length > 0 && (
          <>
            <h2 className="my-5 text-xl font-semibold">Connection Requests</h2>
            <div className="mb-8">
              {connectionRequests.map((requester) => (
                <div
                  key={requester._id}
                  className="[&>*]:mr-3 [&>*]:my-2 border-b-2 flex justify-between items-center"
                >
                  <span>{requester.username}</span>
                  <div className="flex gap-2">
                    <button
                      className="border-2 rounded px-3 py-1 bg-green-500 text-white hover:bg-green-600"
                      onClick={() => handleAcceptRequest(requester)}
                    >
                      Accept
                    </button>
                    <button
                      className="border-2 rounded px-3 py-1 bg-gray-200 hover:bg-gray-300"
                      onClick={() => handleDeclineRequest(requester)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <h1 className="my-5">Your Connections</h1>

        {connections.map((connection) => {
          return (
            <div
              key={connection._id || connection.username}
              className="[&>*]:mr-3 [&>*]:my-2 border-b-2 flex justify-between"
            >
              <span>{connection.username}</span>
              <button
                className="border-2 rounded px-2"
                onClick={() => handleRemoveConnection(connection)}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
