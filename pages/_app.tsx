import "../styles/globals.css";
import store from "../context/store"
import { Provider } from "react-redux";
import type { AppProps } from 'next/app';
import Header from '../components/Header'
import Copyright from '../components/Copyright'
import Swal from "sweetalert2"
import { useRouter } from 'next/router'
import { GetToken } from "../api";
import { useEffect, useState } from "react";
import { IUser } from "../types/user";
import { checkExpirationDateJwt } from "../static";



const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const IsBrowser = typeof window !== 'undefined';
  const isFound = IsBrowser && localStorage.getItem("user");
  const user: IUser = isFound && JSON.parse(isFound);
  const [isExpired, setIsExpired] = useState(false)
  const [check, setCheck] = useState(0)

  const SwalError = () => {
    Swal.fire({
      title: "you need To login",
      text: 'Please login again',
      icon: 'error',
      confirmButtonText: 'OK',
      showCancelButton: true,
    }).then((result) => result.value && router.push('/login'));
  };

  const getToken = async () => {
    await GetToken().then(({ data }: any) => {
      user.token = data.token;
      localStorage.setItem('user', JSON.stringify(user))
    }).catch(err => {
      if (err) SwalError();
    })
  }

  useEffect(() => {
    if (user) getToken();
  }, [])

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        setIsExpired(checkExpirationDateJwt(user?.token));
        if (user && isExpired) getToken();
        setCheck(check + 1)
      }, 1000 * 60 * 2); // every 2 minutes
      return () => clearInterval(interval); 
    }
  }, [check])

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