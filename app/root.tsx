import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import styles from "tailwind.css";
import Aleo from "public/fonts/Aleo-VariableFont_wght.ttf";
import AleoItalic from "public/fonts/Aleo-Italic-VariableFont_wght.ttf";
import Wrapper from "~/components/layout/Wrapper";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: Aleo },
  { rel: "stylesheet", href: AleoItalic },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "icon", href: "/icon.svg" },
  { rel: "apple-touch-icon", href: "/apple-icon.png" },
];

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </h1>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="en" style={{ fontFamily: "'Aleo', serif" }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Wrapper>
          <Outlet />
        </Wrapper>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
