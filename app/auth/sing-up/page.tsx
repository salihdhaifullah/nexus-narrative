import Image from 'next/image';
import Form from './Form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up for a Blog Account | NexusNarrative',
  description: 'Create a new blog account to start sharing your thoughts, experiences, and expertise. Join our blogging community at NexusNarrative.',
};

const SingUp = () => {
  return (
    <section className='w-full h-full mt-20 flex justify-center items-center'>
      <div className='rounded-md bg-normal shadow-lg p-8 h-full flex justify-center items-center flex-col mt-2'>

        <div>
          <Image alt="logo" src="/logo.svg" width={80} height={80} />
        </div>

        <h1 className='text-secondary text-4xl'> Sign up </h1>

        <Form />
      </div>
    </section>
  );
}

export default SingUp;
