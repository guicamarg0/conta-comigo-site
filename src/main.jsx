import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { App } from "./App.jsx";
import FAQPage from "./FAQPage.jsx";
import "./landing.css";

const root = document.getElementById("root");
const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const Page = normalizedPath === "/perguntas-frequentes" ? FAQPage : App;
const app = (
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
