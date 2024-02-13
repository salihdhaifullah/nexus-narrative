import { Outlet, ScrollRestoration } from "react-router-dom";
import Wrapper from "@/components/layout/Wrapper";
import { useEffect } from "react";
import Provider from "./context";


export default function Layout() {
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
      <>
        <Provider>
          <Wrapper>
            <Outlet />
          </Wrapper>
        </Provider>

        <ScrollRestoration />
      </>
  );
}

