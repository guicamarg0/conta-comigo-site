import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outputFile = path.join(projectRoot, "dist", "index.html");
const vite = await createServer({
  root: projectRoot,
  configFile: path.join(projectRoot, "vite.config.mjs"),
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const page = renderToString(React.createElement(React.StrictMode, null, React.createElement(App)));
  const html = await readFile(outputFile, "utf8");
  const marker = '<div id="root"></div>';
  if (!html.includes(marker)) throw new Error("Root container not found in built HTML");
  await writeFile(outputFile, html.replace(marker, `<div id="root">${page}</div>`));
} finally {
  await vite.close();
}
