"use client"

import { FormEvent, useState } from 'react';
import Link from "next/link";
import useFetchApi from '@/hooks/useFetchApi';
import TextFiled from '@/components/utils/TextFiled';
import { FaUserCircle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '@/components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '@/components/utils/Button';

interface ISingUp {
    password: string;
    firstName: string;
    lastName: string;
    email: string;
}

const Form = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [passwordType, setPasswordType] = useState("password")
    const [payload, call] = useFetchApi<ISingUp>("POST", "sing-up")

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
                    { validate: (str: string) => str.length > 0, massage: "first name is required" },
                    { validate: (str: string) => str.length <= 50, massage: "max length of first name is 50 character" }
                ]}
                icon={FaUserCircle}
                value={firstName}
                setValue={setFirstName}
                label="first name"
            />

            <TextFiled
                validation={[
                    { validate: (str: string) => str.length > 0, massage: "last name is required" },
                    { validate: (str: string) => str.length <= 50, massage: "max length of last name is 50 character" }
                ]}
                icon={FaUserCircle}
                value={lastName}
                setValue={setLastName}
                label="last name"
            />

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
                <Link href="/auth/login" className="link">login ?</Link>
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
