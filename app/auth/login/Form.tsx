"use client"

import { FormEvent, useState } from 'react';
import Link from "next/link";
import useFetchApi from '@/hooks/useFetchApi';
import TextFiled from '@/components/utils/TextFiled';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '@/components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '@/components/utils/Button';


interface ILogin {
    password: string;
    email: string;
}

const Form = () => {
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [passwordType, setPasswordType] = useState("password")

    const [payload, call] = useFetchApi<ILogin>("POST", "login")

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      call()
    };


    return (

        <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className='flex flex-col'
        >
            <TextFiled
                validation={[
                    { validate: (str: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str), massage: "un-valid email address" },
                    { validate: (str: string) => str.length <= 100, massage: "max length of email address is 100 character" }
                ]}
                icon={MdEmail}
                value={email}
                setValue={setEmail}
                label="email address"
            />

            <TextFiled
                validation={[{ validate: (str: string) => str.length >= 8, massage: "min length of password is 8 character" }]}
                icon={RiLockPasswordFill}
                value={password}
                inputProps={{ type: passwordType }}
                setValue={setPassword}
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
    )
}

export default Form
