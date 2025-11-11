import { useState } from "react";
import Eye from "../../assets/eye.svg?react";
import CrossedEye from "../../assets/eye-crossed.svg?react";

export default function InputField({ label, name = label, type = "text", value, onChange }) {
  return (
    <label>
      <div>{label}</div>
      <input
        name={name}
        className={"w-64"}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export function PasswordField({ value, onChange }) {
  const [showText, setShowText] = useState(false);

  return (
    <label>
      <div>Password</div>
      <div className="relative">
        <input
          className="w-64 !pr-8"
          name={"Password"}
          type={showText ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div
          className="cursor-pointer absolute top-1/2 -translate-y-1/2 right-2"
          role="button"
          onClick={() => setShowText((p) => !p)}
        >
          {showText ? <Eye width={24} /> : <CrossedEye width={24} />}
        </div>
      </div>
    </label>
  );
}
