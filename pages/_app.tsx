import "../styles/globals.css";
import store from "../context/store"
import { Provider } from "react-redux";
import type { AppProps } from 'next/app';
import Header from '../components/Header'
import Copyright from '../components/Copyright'


const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Provider store={store}>
        <Header />
        <Component {...pageProps} />
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Provider>
    </>
  );
}

export default MyApp;