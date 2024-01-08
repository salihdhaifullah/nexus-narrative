import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import "./index.css";

const html = (head: string, app: string) => {
  return (
  `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${head}
      </head>
      <body>
        <div id="root">${app}</div>
        <script type="module" src="/src/client/entry-client.tsx"></script>
      </body>
    </html>
    `
  )
}

export function render(url: string) {
  console.log(url);

  const app = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  );

  return html(`<title>${map[url]}</title>` || "", app);
}

const map = {
  "/": "hello world",
  "/about": "about page",
  "/dashboard": "dashboard page",
  "/nothing-here": "nothing-here page"
}
