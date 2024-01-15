import type { LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import styles from "tailwind.css";
import Aleo from "public/fonts/Aleo-VariableFont_wght.ttf";
import AleoItalic from "public/fonts/Aleo-Italic-VariableFont_wght.ttf";
import Wrapper from "~/components/layout/Wrapper";
import { useEffect } from "react";



export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: Aleo },
  { rel: "stylesheet", href: AleoItalic },
  { rel: "icon", href: "/favicon.ico" },
  { rel: "icon", href: "/favicon-16x16.png" },
  { rel: "icon", href: "/favicon-32x32.png" },
  { rel: "icon", href: "/icon.svg" },
  { rel: "manifest", href: "/manifest.json" },
  { rel: "apple-touch-icon", href: "/apple-icon.png" },
];

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <html lang="en">
      <head>
        <title>Oops!</title>
        <meta name="theme-color" content="#CBD18F" />
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

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [])

  return (
    <html lang="en" style={{ fontFamily: "'Aleo', serif" }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#CBD18F" />
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
