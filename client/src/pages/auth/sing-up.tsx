import { FormEvent, useCallback, useEffect, useState } from 'react';
import TextFiled from '../../components/utils/TextFiled';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '../../components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '../../components/utils/Button';
import { Link } from 'react-router-dom';
import { useHeadDispatch } from '../../context/head';
import useFetchApi from '../../hooks/useFetchApi';

const Head = () => {
    return {
        title: 'Sign Up for a Blog Account | NexusNarrative',
        meta: [
            { name: "description", content: 'Create a new blog account to start sharing your thoughts, experiences, and expertise. Join our blogging community at NexusNarrative.' }
        ]
    };
};

interface IData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

const SingUp = () => {
    const [passwordType, setPasswordType] = useState("password")

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const HeadDispatch = useHeadDispatch()

    const [payload, call] = useFetchApi<unknown, IData>("POST", "auth/sing-up")

    const HandelSubmit = useCallback((e: FormEvent) => {
        e.preventDefault()
        call({ password, email, firstName, lastName })
    }, [call, email, firstName, lastName, password])

    useEffect(() => {
        HeadDispatch({ payload: Head() })
    }, [HeadDispatch])

    return (
        <section className='w-full h-full mt-20 flex justify-center items-center'>
            <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

                <div>
                    <img alt="logo" src="/logo.svg" width={80} height={80} />
                </div>

                <h1 className='text-secondary text-4xl'> Sing Up </h1>
                <form className='flex flex-col' onSubmit={(e) => HandelSubmit(e)}>
                    <TextFiled
                        icon={MdEmail}
                        label="first name"
                        name="firstName"
                        required
                        value={firstName}
                        setValue={setFirstName}
                    />

                    <TextFiled
                        icon={MdEmail}
                        label="last name"
                        name="lastName"
                        required
                        value={lastName}
                        setValue={setLastName}
                    />

                    <TextFiled
                        icon={MdEmail}
                        label="email address"
                        name="email"
                        required
                        value={email}
                        setValue={setEmail}
                        type='email'
                    />

                    <TextFiled
                        icon={RiLockPasswordFill}
                        type={passwordType}
                        label="password"
                        required
                        value={password}
                        setValue={setPassword}
                        name="password"
                        InElement={<PasswordEye type={passwordType} setType={setPasswordType} />}
                    />

                    <div className="flex justify-end items-center w-full px-4 pb-2">
                        <Link to="/auth/login" className="link">login ?</Link>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full my-1">
                        <Button isLoading={payload.isLoading} type="submit">submit</Button>
                    </div>

                </form>
            </div>
        </section>
    );
}

export default SingUp;
