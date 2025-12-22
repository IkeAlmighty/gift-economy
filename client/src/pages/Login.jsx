import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { useUser } from "../Contexts/UserContext";
import InputField, { PasswordField } from "../components/InputField";
import MarketArt from "../../assets/studies_of_market_figures.jpg";

function getModeText(mode) {
  return mode == "signup" ? "Sign Up" : mode == "forgotPassword" ? "Reset Password" : "Login";
}

function getActionText(mode) {
  return mode == "signup" ? "Sign Up" : mode == "forgotPassword" ? "Send E-mail" : "Login";
}

// TODO: implement forgot password mode
export default function Login({ mode = "login" }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { login, signup } = useUser();
  const [username, setUsername] = useState("");
  const [screenName, setScreenName] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogin() {
    const { error } = await login({ username, password });

    if (!error) {
      const callback = searchParams.get("callback");
      if (callback) navigate(callback);
      else navigate("/");
    } else {
      setErrorMessage(error);
    }
  }

  async function handleSignup() {
    const { error } = await signup({ username, screenName, password });

    if (!error) {
      const callback = searchParams.get("callback");
      if (callback) navigate(callback);
      else navigate("/");
    } else {
      setErrorMessage(error);
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    if (mode == "login") {
      handleLogin();
    } else if (mode == "signup") {
      handleSignup();
    } else if (mode == "forgotPassword") {
      // TODO
    }
  }

  function onModeSwap(newMode) {
    navigate(newMode);
    setErrorMessage("");
  }

  return (
    <div className="absolute left-0 flex w-screen h-screen align-items-center">
      <div className="flex-3 h-full">
        <img className={"h-full object-cover"} src={MarketArt} alt="Marketplace Picture" />
      </div>
      <div className="flex-2 flex flex-col gap-4 my-auto mx-16">
        <h1>{getModeText(mode)}</h1>
        <form className="flex flex-col gap-2 w-fit" onSubmit={onSubmit}>
          <InputField label={"Username"} value={username} onChange={(v) => setUsername(v)} />
          {mode === "signup" && (
            <InputField
              label={"Screen Name"}
              value={screenName}
              onChange={(v) => setScreenName(v)}
            />
          )}
          <PasswordField value={password} onChange={(v) => setPassword(v)} />
          <div className="h-6 text-red-600 italic">{errorMessage}</div>
          <input
            className="m-auto w-48 border-0 cursor-pointer text-white bg-cyan-800 hover:bg-cyan-700 active:bg-cyan-900"
            type="submit"
            value={getActionText(mode)}
          />
          {(mode == "login" || mode == "signup") && (
            <div
              role="button"
              className="text-sm font-semibold m-auto text-cyan-800 cursor-pointer hover:underline"
              onClick={() => onModeSwap(mode == "login" ? "/signup" : "/login")}
            >
              {mode == "login" ? "Sign Up" : "Aready have an account?"}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
