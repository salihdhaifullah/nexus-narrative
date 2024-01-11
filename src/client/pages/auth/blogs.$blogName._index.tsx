import { useEffect } from 'react';
import { LoaderFunctionArgs, json } from 'react-router';
import ProfileTemplate from '@components/utils/ProfileTemplate';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { blogName } = params;
  if (!blogName) throw new Error("Missing blogName param");

  const user = await prisma.user.findUnique({
    where: { blogName: blogName },
    select: {
      profile: true,
      firstName: true,
      lastName: true,
      title: true,
      about: true,
      email: true,
      blogName: true,
      phoneNumber: true,
      country: true,
      city: true,
      _count: { select: { posts: true } }
    }
  });

  if (!user) throw new Response("Not Found", { status: 404 });


  const cookie = createCookie("test", {
    path: "/",
    sameSite: "strict",
    expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 180) /* 180 days */),
  });


  return json({ user })
}

const Profile = () => {
  const { user } = useLoaderData<typeof loader>();

  useEffect(() => { console.log(document.cookie.split("theme=")[1].split(";")[0]) }, [])

  return (
    <div className='w-full h-fit mb-10'>
      <div>
        <ProfileTemplate data={user} />
      </div>
    </div>
  )
}

export default Profile;
