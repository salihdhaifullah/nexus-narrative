import TextFiled from '../../components/utils/TextFiled';
import { RiLockPasswordFill } from "react-icons/ri";
import Button from '../../components/utils/Button';
import { Form, useActionData, useNavigation } from 'react-router-dom';

export const meta = () => {
  return [
    { title: 'Account Verification | NexusNarrative' },
    { name: 'description', content: 'Verify your account at NexusNarrative. Complete the account verification process to access your blog account and connect with the community.' },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const code = String(formData.get("code"));

  const data = { code };

  const res = CodeSchema.validate(data)

  if (res.isError) return customResponse({ validationError: res.errors, status: 400 });
  const cookieHeader = request.headers.get("Cookie");
  const singUpSessionId = (await singUpSessionCookie.parse(cookieHeader)) || {};
  const sessionJson = await cache.get(singUpSessionId)

  console.log(sessionJson)

  if (sessionJson === null) return customResponse({
    status: 400,
    error: "sing-up session expired, please try to sing-up"
  })

  const session = JSON.parse(sessionJson) as (typeof SingUpSessionSchema.type);

  const res1 = SingUpSessionSchema.validate(session)

  if (res1.isError) return customResponse({
    status: 400,
    error: "sing-up session is un-valid, please try to sing-up"
  })

  return await createUser(session);
}

const AccountVerification = () => {
  const data = useActionData<typeof action>();
  const navigation = useNavigation();

  return (
    <section className='w-full h-full mt-20 flex justify-center items-center'>
      <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

        <div>
          <img alt="logo" src="/logo.svg" width={80} height={80} />
        </div>

        <h1 className='text-secondary text-4xl'> account verification </h1>

        <Form className='flex flex-col' method="post">
          {!data?.error ? null : (
            <div className='w-60 place-self-center my-4 flex flex-col text-center p-2 rounded-md bg-red-200'>
              <p className='text-red-600'>{data.error}</p>
            </div>
          )}

          <TextFiled
            icon={RiLockPasswordFill}
            label="verification code"
            required
            name="code"
            error={data?.validationError?.code}
          />

          <div className="flex flex-col justify-center items-center w-full my-1">
            <Button isLoading={navigation.state === "submitting"} type="submit">submit</Button>
          </div>

        </Form>
      </div>
    </section>
  );
}

export default AccountVerification;
