import { useEffect, useState } from 'react';
import TextFiled from '~/components/utils/TextFiled';
import { MdEmail } from 'react-icons/md/index.js';
import PasswordEye from '~/components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri/index.js";
import Button from '~/components/utils/Button';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { ActionFunctionArgs, MetaFunction, json } from '@remix-run/node';
import Schema from '~/utils/validate';
import { prisma } from '~/db.server';
import { useUserDispatch } from '~/context/user';
import { login } from '~/data/user.server';

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

  const schema = new Schema<typeof data>()
    .property("email", (v) => v.required("email is required").email("un-valid email address"))
    .property("password", (v) => v.required("password is required").max(200, "max length of password is 200").min(8, "min length of the password is 8"))

  const res = schema.validate(data)

  if (res.isError) return json({ validationError: res.errors, error: null, data: null }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) return json({ error: `user with this email ${email} dose not exist, please try sing up`, validationError: null, data: null }, { status: 404 })

  return await login({user, password});
}



const Login = () => {
  const [passwordType, setPasswordType] = useState("password")
  const data = useActionData<typeof action>();
  const navigation = useNavigation();
  const dispatch = useUserDispatch();
  useEffect(() => { dispatch({type: "add", payload: data?.data || undefined}) }, [])

  return (
    <section className='w-full h-full mt-20 flex justify-center items-center'>
      <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

        <div>
          <img alt="logo" src="/logo.svg" width={80} height={80} />
        </div>

        <h1 className='text-secondary text-4xl'> login </h1>
        {!data?.error ? null : (
          <p>
            {data.error}
          </p>
        )}
        <Form className='flex flex-col' method="post">
          <TextFiled
            icon={MdEmail}
            label="email address"
            name="email"
            required
            error={data?.validationError?.email}
            type='email'
          />

          <TextFiled
            icon={RiLockPasswordFill}
            type={passwordType}
            label="password"
            required
            name="password"
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