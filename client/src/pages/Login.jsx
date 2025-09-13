import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useUser } from "../Contexts/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { login } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await login({ username, password });

    if (!error) {
      const callback = searchParams.get("callback");
      if (callback) navigate(callback);
      else navigate("/");
    }
  }

  return (
    <div className="my-5 mx-2">
      <h1>Login</h1>
      <form className="[&>*]:my-5" onSubmit={handleLogin}>
        <label>
          <div>Username:</div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          <div>Password:</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div>
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
}
