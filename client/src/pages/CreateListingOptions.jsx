import { Link } from "react-router";

export default function CreateListingOptions() {
  return (
    <>
      <div className="flex flex-col space-y-10 my-20 bg-white text-2xl text-center">
        <div className="underline">Choose One:</div>
        <Link to="/create-gift">Post Gift 🎁</Link>
        <Link to="/create-request">Post Request 🪫</Link>
        <Link to="/create-project">Create Project 🏗️</Link>
      </div>
    </>
  );
}
