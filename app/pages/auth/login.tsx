import { useEffect, useState } from 'react';
import TextFiled from '~/components/utils/TextFiled';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '~/components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '~/components/utils/Button';
import { Form, Link, useActionData, useNavigate, useNavigation } from '@remix-run/react';
import { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { useUserDispatch } from '~/context/user';
import { customResponse, login } from '~/data/user.server';
import { LoginSchema } from '~/dto/auth';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login to Your Blog Account | NexusNarrative' },
    { name: "description", content: 'Login to access your blog account. Connect with the community, share your thoughts, and engage with fellow bloggers at NexusNarrative.' }
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const data = { email, password };

  const res = LoginSchema.validate(data)

  if (res.isError) return customResponse({ validationError: res.errors, status: 400 });

  return await login(data);
}

const Login = () => {
  const [passwordType, setPasswordType] = useState("password")
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const navigate = useNavigate();
  const dispatch = useUserDispatch();

  useEffect(() => {
    if (!data?.data) return;
    dispatch({type: "add", payload: data.data })
    navigate(`/${data.data.blog}`)
  }, [data?.data, navigate, dispatch])

  return (
    <section className='w-full h-full mt-20 flex justify-center items-center'>
      <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

        <div>
          <img alt="logo" src="/logo.svg" width={80} height={80} />
        </div>

        <h1 className='text-secondary text-4xl'> login </h1>

        <Form className='flex flex-col' method="post">
        {!data?.error ? null : (
          <div className='w-60 place-self-center my-4 flex flex-col text-center p-2 rounded-md bg-red-200'>
            <p className='text-red-600'>{data.error}</p>
          </div>
        )}
          <TextFiled
            icon={MdEmail}
            label="email address"
            name="email"
            required
            error={data?.validationError?.email}
            type='email'
            autoComplete="username"
          />

          <TextFiled
            icon={RiLockPasswordFill}
            type={passwordType}
            label="password"
            required
            name="password"
            autoComplete="current-password"
            error={data?.validationError?.password}
            InElement={<PasswordEye type={passwordType} setType={setPasswordType} />}
          />

          <div className="flex justify-end items-center w-full px-4 pb-2">
            <Link to="/auth/sing-up" className="link">sing up ?</Link>
          </div>

          <div className="flex flex-col justify-center items-center w-full my-1">
            <Button isLoading={navigation.state === "submitting"} type="submit">submit</Button>
          </div>

        </Form>
      </div>
    </section>
  );
}

export default Login;
