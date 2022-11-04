import "../styles/globals.css";
import store from "../context/store"
import { Provider } from "react-redux";
import type { AppProps } from 'next/app';
import Header from '../components/Header'
import Copyright from '../components/Copyright'
import Swal from "sweetalert2"
import { useRouter } from 'next/router'
import { GetToken } from "../api";
import { useCallback, useEffect, useState } from "react";
import { IUser } from "../types/user";
import { checkExpirationDateJwt } from "../static";
import NextNProgress from 'nextjs-progressbar';
import CircularProgress from '@mui/material/CircularProgress'


const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const [user, setUser] = useState<IUser | null>(null)
  const [isBrowser, setIsBrowser] = useState(false)

  const [isExpired, setIsExpired] = useState(false)
  const [check, setCheck] = useState(0)

  const SwalError = useCallback(() => {
    Swal.fire({
      title: "you need To login",
      text: 'Please login again',
      icon: 'error',
      confirmButtonText: 'OK',
      showCancelButton: true,
    }).then((result) => result.value && router.push('/login'));
  }, [router])

  const getToken = useCallback(async () => {
    if (!user) return;
    await GetToken().then(({ data }: any) => {
      user.token = data.token;
      localStorage.setItem('user', JSON.stringify(user))
    }).catch(err => {
      if (err) SwalError();
    })
  }, [SwalError, user])


  const getUser = useCallback(() => {
    if (isBrowser) {
      const isFound = localStorage.getItem("user");
      if (isFound)  setUser(JSON.parse(isFound));
    }
  }, [isBrowser]);

  useEffect(() => {
    setIsBrowser(true)
    getUser()
  }, [getUser])

  // useEffect(() => {
  //   if (user) getToken();
  // }, [])

  // useEffect(() => {
  //   if (user) {
  //     const interval = setInterval(() => {
  //       setIsExpired(checkExpirationDateJwt(user?.token));
  //       if (user && isExpired) getToken();
  //       setCheck(check + 1)
  //     }, 1000 * 60 * 2); // every 2 minutes
  //     return () => clearInterval(interval); 
  //   }
  // }, [check])

  return (

    <div className="flex flex-col min-h-[100vh]">
      <Provider store={store}>
        <NextNProgress />
        {isBrowser ? (
          <>
            <Header />
            <Component {...pageProps} />
            <Copyright />
          </>
        ) : (
          <CircularProgress />
        )}

      </Provider>
    </div>
  );
}

export default MyApp;