import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useUser } from "../Contexts/UserContext";
import { sendConnectionRequest, removeConnection } from "../endpoints/user";
import { toast } from "react-toastify";
import ToolBar from "../components/ToolBar";
import LogoutButton from "../components/LogoutButton";

export default function ConnectionsPage() {
  const { user, loading, hydrateUser } = useUser();
  const [newConnection, setNewConnection] = useState("");

  async function handleSendConnectionRequest(e) {
    e.preventDefault();
    const res = await sendConnectionRequest(newConnection);

    if (res.ok) {
      const { message, connectionMade } = await res.json();
      toast(message);
      if (connectionMade) {
        hydrateUser();
      }
    } else {
      const { error } = await res.json();
      toast(error);
    }

    setNewConnection("");
  }

  async function handleRemoveConnection(connection) {
    const res = await removeConnection(connection.username);

    if (res.ok) {
      const { message } = await res.json();
      toast(message);
      hydrateUser();
    }
  }

  if (loading) return <>...Loading</>;

  return (
    <div>
      <ToolBar>
        <span />
        <button>
          <Link to="/">Back to Feed</Link>
        </button>
        <LogoutButton />
      </ToolBar>

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

        <h1 className="my-5">Your Connections</h1>

        {user?.connections?.map((connection) => {
          return (
            <div className="[&>*]:mr-3 [&>*]:my-2 border-b-2 flex justify-between">
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
