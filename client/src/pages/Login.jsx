import { useState } from "react";
import { useSearchParams } from "react-router";
import { login } from "../API/user";

export default function Login() {
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    const response = await login({ username, password });
    console.log(response);

    if (response.ok) {
      console.log(searchParams);
    }
  }

  return (
    <div className="my-5">
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
