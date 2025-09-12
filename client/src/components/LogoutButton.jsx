import { useUser } from "../Contexts/UserContext";

export default function LogoutButton() {
  const { logout } = useUser();
  function handleClick() {
    logout();
  }

  return <button onClick={handleClick}>Log Out</button>;
}
