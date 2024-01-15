import { useState } from 'react';
import TextFiled from '~/components/utils/TextFiled';
import { MdEmail } from 'react-icons/md';
import PasswordEye from '~/components/utils/PasswordEye';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '~/components/utils/Button';
import { Form, Link, useActionData, useNavigation } from '@remix-run/react';
import { ActionFunctionArgs, MetaFunction, json } from '@remix-run/node';
import Schema from '~/utils/validate';
import { singUp } from '~/data/user.server';

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

    const schema = new Schema<typeof data>()
        .property("email", (v) => v
            .required("email is required")
            .email("un-valid email address"))
        .property("password", (v) => v
            .required("password is required")
            .max(200, "max length of password is 200")
            .min(8, "min length of the password is 8"))
        .property("lastName", (v) => v
            .required("lastName is required")
            .max(200, "max length of lastName is 200")
            .min(2, "min length of the lastName is 2"))
        .property("firstName", (v) => v
            .required("firstName is required")
            .max(200, "max length of firstName is 200")
            .min(2, "min length of the password is 2"))

    const res = schema.validate(data)

    if (res.isError) return json({ validationError: res.errors, error: null, data: null }, { status: 400 });

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
