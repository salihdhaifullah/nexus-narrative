import { useLoaderData } from '@remix-run/react';
import { LoaderFunctionArgs, json } from 'react-router';
import ProfileTemplate from '~/components/utils/ProfileTemplate';
import { prisma } from '~/db.server';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { blog } = params;
  if (!blog) throw new Error("Missing blog param");

  const user = await prisma.user.findUnique({
    where: { blog: blog },
    select: {
      avatarUrl: true,
      firstName: true,
      lastName: true,
      title: true,
      about: true,
      email: true,
      blog: true,
      phoneNumber: true,
      country: true,
      city: true,
      _count: { select: { posts: true } }
    }
  });

  if (!user) throw new Response("Not Found", { status: 404 });

  return json({ user })
}

const Profile = () => {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className='w-full h-fit mb-10'>
      <div>
        <ProfileTemplate data={user} />
      </div>
    </div>
  )
}

export default Profile;
