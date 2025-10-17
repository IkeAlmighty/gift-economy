import { useNavigate } from "react-router";
export default function CreateListing() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col space-y-10 my-20 bg-white text-2xl">
        <div className="text-center underline">Choose One:</div>
        <button onClick={() => navigate("/create-gift")}>Post Gift 🎁</button>
        <button onClick={() => navigate("/create-request")}>Post Request 🪫</button>
        <button onClick={() => navigate("/create-project")}>Create Project 🏗️</button>
      </div>
    </>
  );
}
