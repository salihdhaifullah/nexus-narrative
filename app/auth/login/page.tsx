"use client"

import { FormEvent, useState } from 'react';
import Link from "next/link";
import useFetchApi from '@/hooks/useFetchApi';
import Image from 'next/image';
import TextFiled from '@/components/utils/TextFiled';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '@/components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '@/components/utils/Button';


interface ILogin {
  password: string;
  email: string;
}

const Login = () => {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [passwordType, setPasswordType] = useState("password")

  const [payload, call] = useFetchApi<ILogin>("POST", "login")

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    call()
  };

  return (
    <section className='w-full h-full mt-20 flex justify-center items-center'>
      <div className='rounded-md bg-normal shadow-lg w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] p-8 h-full flex justify-center items-center flex-col mt-2'>

        <div>
          <Image alt="logo" src="/logo.svg" width={80} height={80} priority />
        </div>

        <h1> login </h1>

        <form onSubmit={handleSubmit}>

          <TextFiled
            validation={[
              { validate: (str: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str), massage: "un-valid email address" },
              { validate: (str: string) => str.length <= 100, massage: "max length of email address is 100 character" }
            ]}
            icon={MdEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="email address"
          />

          <TextFiled
            validation={[{ validate: (str: string) => str.length >= 8, massage: "min length of password is 8 character" }]}
            icon={RiLockPasswordFill}
            value={password}
            inputProps={{ type: passwordType }}
            onChange={(e) => setPassword(e.target.value)}
            label="password"
            InElement={<PasswordEye type={passwordType} setType={setPasswordType} />}
          />


          <div className="flex justify-end items-center w-full px-4 pb-2">
            <Link href="/auth/sing-up" className="link">sing up ?</Link>
          </div>

          <div className="flex flex-col justify-center items-center w-full my-1">
            <Button
              buttonProps={{ type: "submit" }}
              isLoading={payload.isLoading}
            >submit</Button>
          </div>

        </form>
      </div>
    </section>
  );
}

export default Login;
