import { useEffect, useState } from 'react';
import TextFiled from 'components/utils/TextFiled';
import { MdEmail } from 'react-icons/md/index.js';
import PasswordEye from 'components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri/index.js";
import Button from 'components/utils/Button';
import { Form, Link, useActionData } from '@remix-run/react';
import { ActionFunctionArgs, MetaFunction, json, redirect } from '@remix-run/node';
import Joi from 'joi';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login to Your Blog Account | NexusNarrative' },
    { name: "description", content: 'Login to access your blog account. Connect with the community, share your thoughts, and engage with fellow bloggers at NexusNarrative.' }
  ];
};

interface ILogin {
  password: string;
  email: string;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const shcame = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(8).max(250)
  })

  const res = shcame.validate({ email, password })

  if (res.error) return json({ error: res.error });

  return redirect("/");
}

const Login = () => {
  const [passwordType, setPasswordType] = useState("password")
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    console.log(actionData)
  }, [actionData])

  return (
    <section className='w-full h-full mt-20 flex justify-center items-center'>
      <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

        <div>
          <img alt="logo" src="/logo.svg" width={80} height={80} />
        </div>

        <h1 className='text-secondary text-4xl'> login </h1>

        <Form autoComplete="off" className='flex flex-col' method="post">
          <p>
            {actionData?.error.details[0].message}
          </p>
          <TextFiled
            icon={MdEmail}
            label="email address"
            name="email"
            required
          // type='email'
          />

          <TextFiled
            icon={RiLockPasswordFill}
            type={passwordType}
            label="password"
            required
            name="password"
            InElement={<PasswordEye type={passwordType} setType={setPasswordType} />}
          />


          <div className="flex justify-end items-center w-full px-4 pb-2">
            <Link to="/auth/sing-up" className="link">sing up ?</Link>
          </div>

          <div className="flex flex-col justify-center items-center w-full my-1">
            <Button type="submit">submit</Button>
          </div>

        </Form>
      </div>
    </section>
  );
}

export default Login;
