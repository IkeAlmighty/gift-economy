// Entry point for the Electron renderer process (React root)
// Import your main App component and render it here

import { createRoot } from "react-dom/client";
import App from "./presentation/App";

createRoot(document.getElementById("root")).render(<App />);

// ...additional setup as needed
