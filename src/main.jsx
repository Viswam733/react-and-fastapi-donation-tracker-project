import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RefreshProvider } from "./RefreshContext"; // ✅ import

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RefreshProvider>
      <App />
    </RefreshProvider>
  </React.StrictMode>
);
