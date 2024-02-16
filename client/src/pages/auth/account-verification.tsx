import TextFiled from '../../components/utils/TextFiled';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '../../components/utils/Button';
import useFetchApi from '../../hooks/useFetchApi';
import { useHeadDispatch } from '../../context/head';
import { FormEvent, useCallback, useEffect, useState } from 'react';

const Head = () => {
    return {
        title: 'Account Verification | NexusNarrative',
        meta: [
            { name: 'description', content: 'Verify your account at NexusNarrative. Complete the account verification process to access your blog account and connect with the community.' }
        ]
    }
}


const AccountVerification = () => {
  const HeadDispatch = useHeadDispatch()
  const [payload, call] = useFetchApi<unknown, {code: string}>("PATCH", "auth/account-verification")

  const [code, setCode] = useState("")

  const HandelSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    call({ code })
  }, [call, code])


  useEffect(() => { HeadDispatch({payload: Head()}) }, [HeadDispatch])

    return (
        <section className='w-full h-full mt-20 flex justify-center items-center'>
            <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

                <div>
                    <img alt="logo" src="/logo.svg" width={80} height={80} />
                </div>

                <h1 className='text-secondary text-4xl'> account verification </h1>

                <form className='flex flex-col' onSubmit={(e) => HandelSubmit(e)}>

                    <TextFiled
                        icon={RiLockPasswordFill}
                        label="verification code"
                        required
                        name="code"
                        setValue={setCode}
                        value={code}
                    />

                    <div className="flex flex-col justify-center items-center w-full my-1">
                        <Button isLoading={payload.isLoading} type="submit">submit</Button>
                    </div>

                </form>
            </div>
        </section>
    );
}

export default AccountVerification;
