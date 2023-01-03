import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { demoAccount } from '../api';
import { useRouter } from 'next/router';
import Toast from '../functions/sweetAlert';
import Box from '@mui/material/Box';

const Home: NextPage = () => {

  const router = useRouter();

  const demoHandler = async () => {

    await demoAccount()
      .then(async (res) => {
        Toast.fire("Success", "Successfully Login", 'success');
        localStorage.setItem("user", JSON.stringify(res.data.data));
        await router.push("/posts")
        router.reload()
      })
      .catch(({ response }) => { Toast.fire("something want wrong", response.data.error, 'error') });

  }

  return (
    <>
      <Head>
        <title>blogging website for software developers</title>
        <meta name="description" content="easy to use platform fully functionally where you can write about any thing you want !" />
        <meta name="keywords" content="easy, platform, blogging, website, software, developers, functionally, write, any, thing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="bg-inherit min-h-[80vh] flex justify-center items-center py-8 px-4 lg:py-16 ">
        <div className="flex-col justify-center items-center flex">
          <h1 className="mb-4 max-w-2xl text-center text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl">blogging website for software developers</h1>
          <p className="mb-6 max-w-2xl text-center font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl"> easy to use platform fully functionally where you can write about any thing you want ! , get started now and create your account by clicking in this button .</p>

          <Box className="flex flex-row gap-2">
            <Link href="/sing-up" >
              <a className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 ">
                Get started
                <ArrowForwardIosIcon className="text-xs ml-2" />
              </a>
            </Link>

            <div onClick={demoHandler} className="inline-flex justify-center items-center bg-blue-500  py-3 px-3 cursor-pointer text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-blue-600 focus:ring-4 focus:ring-gray-100 ">
              Demo account
              <ArrowForwardIosIcon className="text-xs ml-2" />
            </div>

          </Box>
        </div>
      </section>
    </>
  )
}

export default Home




