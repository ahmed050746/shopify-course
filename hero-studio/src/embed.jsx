import React from "react";
import ReactDOM from "react-dom/client";
import ManagedAgentsHero from "./components/ManagedAgentsHero.jsx";
import "./index.css";

const mount = document.getElementById("desktop-hero-root");
if (mount) {
  ReactDOM.createRoot(mount).render(
    <React.StrictMode>
      <ManagedAgentsHero />
    </React.StrictMode>
  );
}