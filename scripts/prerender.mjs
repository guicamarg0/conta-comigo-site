import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outputDirectory = path.join(projectRoot, "dist");
const outputFile = path.join(outputDirectory, "index.html");
const faqOutputDirectory = path.join(outputDirectory, "perguntas-frequentes");
const faqOutputFile = path.join(faqOutputDirectory, "index.html");
const faqUrl = "https://site-contacomigo.pages.dev/perguntas-frequentes/";
const vite = await createServer({
  root: projectRoot,
  configFile: path.join(projectRoot, "vite.config.mjs"),
  server: { middlewareMode: true },
  appType: "custom",
});

try {
  const { App } = await vite.ssrLoadModule("/src/App.jsx");
  const { default: FAQPage } = await vite.ssrLoadModule("/src/FAQPage.jsx");
  const { faqGroups } = await vite.ssrLoadModule("/src/faq-content.js");
  const html = await readFile(outputFile, "utf8");
  const marker = '<div id="root"></div>';
  if (!html.includes(marker)) throw new Error("Root container not found in built HTML");
  const render = (Page) => renderToString(
    React.createElement(React.StrictMode, null, React.createElement(Page))
  );
  const withRoot = (source, page) => source.replace(marker, `<div id="root">${page}</div>`);
  const withMetadata = (source, { title, description, url }) => {
    const metadata = [
      [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`, "title"],
      [/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${description}" />`, "description"],
      [/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${url}" />`, "canonical"],
      [/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${title}" />`, "Open Graph title"],
      [/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${description}" />`, "Open Graph description"],
      [/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${url}" />`, "Open Graph URL"],
    ];
    return metadata.reduce((html, [pattern, replacement, label]) => {
      const updated = html.replace(pattern, replacement);
      if (updated === html) throw new Error(`Could not update ${label} metadata`);
      return updated;
    }, source);
  };

  const landingHtml = withRoot(html, render(App));
  const faqEntities = faqGroups.flatMap(({ questions }) => questions.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })));
  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${faqUrl}#faq`,
    url: faqUrl,
    mainEntity: faqEntities,
  }).replace(/</g, "\\u003c");
  const faqHtml = withMetadata(withRoot(html, render(FAQPage)), {
    title: "Perguntas frequentes sobre o Conta Comigo",
    description: "Respostas sobre gestão de serviços, orçamentos e contratos para empreendedores e pequenas empresas prestadoras de serviços.",
    url: faqUrl,
  }).replace("</head>", `<script type="application/ld+json">${faqSchema}</script>\n  </head>`);

  await mkdir(faqOutputDirectory, { recursive: true });
  await Promise.all([
    writeFile(outputFile, landingHtml),
    writeFile(faqOutputFile, faqHtml),
  ]);
} finally {
  await vite.close();
}
