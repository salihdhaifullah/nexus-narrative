import { useState } from 'react';
import TextFiled from '~/components/utils/TextFiled';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '~/components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '~/components/utils/Button';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { customResponse, singUp } from '~/data/user.server';
import { SingUpSchema } from '~/dto/auth';

export const meta: MetaFunction = () => {
    return [
        { title: 'Sign Up for a Blog Account | NexusNarrative' },
        { name: "description", content: 'Create a new blog account to start sharing your thoughts, experiences, and expertise. Join our blogging community at NexusNarrative.' }
    ];
};

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));

    const data = { email, password, firstName, lastName };

    const res = SingUpSchema.validate(data)

    if (res.isError) return customResponse({ validationError: res.errors, status: 400 });

    return await singUp(data);
}

const SingUp = () => {
    const [passwordType, setPasswordType] = useState("password")
    const data = useActionData<typeof action>();
    const navigation = useNavigation();

    return (
        <section className='w-full h-full mt-20 flex justify-center items-center'>
            <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

                <div>
                    <img alt="logo" src="/logo.svg" width={80} height={80} />
                </div>

                <h1 className='text-secondary text-4xl'> Sing Up </h1>
                {!data?.error ? null : (
                    <p>
                        {data.error}
                    </p>
                )}
                <Form className='flex flex-col' method="post">
                    <TextFiled
                        icon={MdEmail}
                        label="first name"
                        name="firstName"
                        required
                        error={data?.validationError?.firstName}
                    />

                    <TextFiled
                        icon={MdEmail}
                        label="last name"
                        name="lastName"
                        required
                        error={data?.validationError?.lastName}
                    />

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
                        <Link to="/auth/login" className="link">login ?</Link>
                    </div>

                    <div className="flex flex-col justify-center items-center w-full my-1">
                        <Button isLoading={navigation.state === "submitting"} type="submit">submit</Button>
                    </div>

                </Form>
            </div>
        </section>
    );
}

export default SingUp;
