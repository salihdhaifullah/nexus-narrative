import "../styles/globals.css";
import type { AppProps } from 'next/app';
import Header from '../components/Header'
import Copyright from '../components/Copyright'
import NextNProgress from 'nextjs-progressbar';
import { useEffect, useState } from 'react'
import Loader from "../components/Loader";

const MyApp = ({ Component, pageProps }: AppProps) => {

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  return (
    <div className="flex flex-col bg-slate-100 min-h-[100vh]">
      <NextNProgress />
      {isBrowser ? (
        <>
          <Header />
          <div className="mb-4 min-h-[68vh] min-w-[95vw]">
          <Component {...pageProps} />
          </div>
          <Copyright />
        </>
      ) : (
        <div className="min-w-[100vw] min-h-[100vh] flex text-blue-600 items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default MyApp;
