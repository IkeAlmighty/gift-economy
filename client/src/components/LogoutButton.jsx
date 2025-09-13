import { useUser } from "../Contexts/UserContext";

export default function LogoutButton() {
  const { logout } = useUser();
  function handleClick() {
    logout();
  }

  return (
    <button className="border-2 rounded px-2 py-1" onClick={handleClick}>
      Logout
    </button>
  );
}
