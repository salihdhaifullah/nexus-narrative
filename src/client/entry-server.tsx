import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { HeadContext } from "./HeadContext";
import "./index.css";

const html = (app: string, head?: string) => {
  return (
  `
    <!doctype html>
    <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${head || "<!-- app head -->"}
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

  const headContext: {head?: () => JSX.Element} = {};

  const app = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
      <HeadContext.Provider value={headContext}>
        <App />
      </HeadContext.Provider>
      </StaticRouter>
    </React.StrictMode>,
  );

  const head = headContext?.head ? ReactDOMServer.renderToString(<headContext.head />) : undefined;
  return html(app, head);
}
