import "../styles/globals.css";
import type { AppProps } from 'next/app';
import Header from '../components/main/Header'
import Copyright from '../components/main/Copyright'
import NextNProgress from 'nextjs-progressbar';
import Loader from "../components/utils/Loader";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter()

  return (
    <div className="flex flex-col bg-slate-100 min-h-[100vh]">
      <NextNProgress />
      <Header />
      {router.isFallback ? <Loader /> : (
          <div className="mb-4 min-h-[68vh] min-w-[95vw]">
            <Component {...pageProps} />
          </div>
      )}
      <Copyright />
    </div>
  );
}

export default MyApp;
