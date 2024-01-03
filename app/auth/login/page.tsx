import Image from 'next/image';
import { Metadata } from 'next';
import Form from './Form';

export const metadata: Metadata = {
  title: 'Login to Your Blog Account | NexusNarrative',
  description: 'Login to access your blog account. Connect with the community, share your thoughts, and engage with fellow bloggers at NexusNarrative.',
};

const Login = () => {
  return (
    <section className='w-full h-full mt-20 flex justify-center items-center'>
      <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

        <div>
          <Image alt="logo" src="/logo.svg" width={80} height={80} />
        </div>

        <h1 className='text-secondary text-4xl'> login </h1>

        <Form />
      </div>
    </section>
  );
}

export default Login;
