import { useEffect, useState } from 'react';
import TextFiled from '@components/utils/TextFiled';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '@components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '@components/utils/Button';
import Schema from '@utils/validate';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { useUserDispatch } from '@context/user';

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

  if (!bcrypt.compareSync(password, user.password)) return json({ error: "password or email is incorrect", validationError: null, data: null }, { status: 400 })

  const fullYear = 1000 * 60 * 60 * 24 * 365;

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

  const cookie = createCookie("token", {
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + fullYear),
  });

  return json({
    data: {
      id: user.id,
      email: user.email,
      lastName: user.lastName,
      firstName: user.firstName
    }, validationError: null, error: null
  }, { headers: { "Set-Cookie": await cookie.serialize(token) }, status: 200 })
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
