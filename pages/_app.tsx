import "../styles/globals.css";
import type { AppProps } from 'next/app';
import Header from '../components/Header'
import Copyright from '../components/Copyright'
import NextNProgress from 'nextjs-progressbar';
import { GetToken } from "../api";
import { useCallback, useEffect, useState } from 'react'
import checkExpirationDateJwt from '../functions/checkExpirationDateJwt';
import { IUser } from '../types/user';
import Loader from "../components/Loader";

const MyApp = ({ Component, pageProps }: AppProps) => {

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  return (

    <div className="flex flex-col bg-slate-100 min-h-[100vh]">
      <TokenHandler />
      <NextNProgress />
      {isBrowser ? (
        <>
          <Header />
          <div className="mb-4 min-h-[68vh]">
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



const getTokenHandler = async (): Promise<string | undefined> => {
  return await GetToken()
    .then((res) => { return res.data.token })
};


export function TokenHandler() {
  const [user, setUser] = useState<IUser | null>(null)
  const getUser = useCallback(() => {
      const data: IUser | null = JSON.parse(localStorage.getItem("user") || JSON.stringify(null));
      if (data) setUser(data);
  }, [])

  useEffect(() => {
      getUser()
  }, [])

  const [isExpired, setIsExpired] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true)
  }, [])


  const checkErrorAndGetToken = useCallback(async () => {
    const token = await getTokenHandler();
    if (!token) return;
    
    if (!user) return getUser();
     
    let userData = { 
      id: user?.id,
      createdAt: user?.createdAt,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
      token: token 
    };
      
    localStorage.setItem("user", JSON.stringify(userData));
  }, [])


  useEffect(() => {
    checkErrorAndGetToken()
  }, [checkErrorAndGetToken])


  useEffect(() => {
    const interval = setInterval(async () => {
      setIsExpired(checkExpirationDateJwt(user?.token as string));
      if (user && isExpired) await checkErrorAndGetToken()

    }, 1000 * 50); // every 50 Seconds
    return () => clearInterval(interval);

  }, [])

  return <></>;
}