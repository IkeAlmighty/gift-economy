import { useUser } from "../Contexts/UserContext";
import { useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function ProfilePage() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");

  const [displayedUser, setDisplayedUser] = useState(null);

  useEffect(() => {
    if (userId === user?.id) navigate("/profile");
    else if (!userId) {
      // Load own profile data
      setDisplayedUser(user);
    } else {
      // Load other user's profile data
    }
  }, [user, searchParams]);

  if (!displayedUser) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="p-2 mx-auto max-w-3xl">
      <h1>Profile | {displayedUser.screenName}</h1>
      {!userId && <p>(you! 😊)</p>}
      <hr className="my-5" />
      <form className="[&>div]:flex [&>div]:flex-row [&>div]:gap-4 [&>div]:mb-4 [&>div>*]:flex-none [&>div>*]:w-[150px]">
        <div>
          <label className="block font-bold mb-1">Screen Name:</label>
          <input
            type="text"
            value={displayedUser.screenName}
            disabled={true} // TODO: connect to backend for editing
            className="border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-bold mb-1">Username:</label>
          <input
            type="text"
            value={displayedUser.username}
            disabled={true} // TODO: connect to backend for editing
            className="border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <div className="block font-bold mb-1">Connections</div>
          <div>{displayedUser.connections?.length || 0} connections</div>
        </div>
      </form>
    </div>
  );
}
