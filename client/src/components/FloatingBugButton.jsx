import { Link } from "react-router";

/**
 * Floating bug button that links to the feedback page.
 */
export default function FloatingBugButton() {
  return (
    <Link
      to="/feedback"
      aria-label="Report a bug or give feedback"
      className="fixed bottom-6 right-6 z-50 hover:opacity-100 opacity-70 transition-opacity"
    >
      <span role="img" aria-label="bug" className="text-4xl drop-shadow-lg  transition-opacity">
        🐞
      </span>
    </Link>
  );
}
