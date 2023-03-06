import "../styles/globals.css";
import type { AppProps } from 'next/app';
import Header from '../components/main/Header'
import Copyright from '../components/main/Copyright'
import NextNProgress from 'nextjs-progressbar';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="flex flex-col bg-slate-100 min-h-[100vh]">
      <NextNProgress />
      <Header />
      <div className="mb-4 min-h-[68vh] min-w-[95vw]">
        <Component {...pageProps} />
      </div>
      <Copyright />
    </div>
  );
}

export default MyApp;
