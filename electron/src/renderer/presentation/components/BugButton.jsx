import { Link } from "react-router";

export default function BugButton() {
  return (
    <Link
      to="/reportbug"
      aria-label="Report a bug or give feedback"
      className="hover:opacity-100 opacity-70 transition-opacity"
    >
      <span role="img" aria-label="bug" className="text-3xl drop-shadow-lg transition-opacity">
        🐞
      </span>
    </Link>
  );
}
