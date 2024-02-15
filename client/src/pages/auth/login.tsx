import { FormEvent, useCallback, useEffect, useState } from 'react';
import TextFiled from '../../components/utils/TextFiled';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '../../components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '../../components/utils/Button';
import { Link, useNavigate } from 'react-router-dom';
import { IUser, useUserDispatch } from '../../context/user';
import useFetchApi from '../../hooks/useFetchApi';
import { useHeadDispatch } from '../../context/head';


const Head = (props: string) => {
  return {
    title: 'Login to Your Blog Account | NexusNarrative' + props,
    meta: [
      { name: "description", content: 'Login to access your blog account. Connect with the community, share your thoughts, and engage with fellow bloggers at NexusNarrative.' }
    ]
  };
};

interface IData {
  password: string;
  email: string;
}

const Login = () => {
  const HeadDispatch = useHeadDispatch()

  const [passwordType, setPasswordType] = useState("password")
  const [data, call] = useFetchApi<IUser, IData>("POST", "auth/login")
  const navigate = useNavigate();
  const dispatch = useUserDispatch();

  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const HandelSubmit = useCallback((e: FormEvent) => {
    e.preventDefault()
    call({ password, email })
  }, [call, email, password])


  useEffect(() => {
    HeadDispatch({payload: Head(password)})
  }, [HeadDispatch, password])

  useEffect(() => {
    if (!data.result) return;
    dispatch({type: "add", payload: data.result })
    navigate(`/${data.result.blog}`)
  }, [data.result, navigate, dispatch])

  return (
    <section className='w-full h-full mt-20 flex justify-center items-center'>
      <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>
        <div>
          <img alt="logo" src="/logo.svg" width={80} height={80} />
        </div>

        <h1 className='text-secondary text-4xl'> login </h1>

        <form className='flex flex-col' onSubmit={(e) => HandelSubmit(e)}>
          <TextFiled
            icon={MdEmail}
            label="email address"
            name="email"
            required
            type='email'
            setValue={setEmail}
            value={email}
            autoComplete="username"
          />

          <TextFiled
            icon={RiLockPasswordFill}
            type={passwordType}
            label="password"
            required
            name="password"
            autoComplete="current-password"
            setValue={setPassword}
            value={password}
            InElement={<PasswordEye type={passwordType} setType={setPasswordType} />}
          />

          <div className="flex justify-end items-center w-full px-4 pb-2">
            <Link to="/auth/sing-up" className="link">sing up ?</Link>
          </div>

          <div className="flex flex-col justify-center items-center w-full my-1">
            <Button isLoading={data.isLoading} type="submit">submit</Button>
          </div>
        </form>

      </div>
    </section>
  );
}

export default Login;
