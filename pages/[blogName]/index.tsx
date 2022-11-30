import Box from '@mui/material/Box';
import FeaturedPost from '../../components/FeaturedPost';
import Sidebar from '../../components/Sidebar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { IFeaturedPostProps } from '../../types/post';
import prisma from '../../libs/prisma';





interface IProps {
  data: {
    about: string | null;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    profile: string | null;

    posts: IFeaturedPostProps[] 
  }
}


export default function Index({ data }: IProps) {

  return (
    <>
      {data ? (
          <Box className="mx-4">
            <main>
              <div className="flex flex-col md:grid grid-cols-5 grid-flow-dense gap-10 my-16">

              <div className="col-span-2">
                  <Sidebar
                    isNotShow={true}
                    description={data?.about || "Not Found"}
                    email={data.email}
                    name={data.firstName + " " + data.lastName}
                    AvatarUrl={data?.profile || "/images/user-placeholder.png"}
                    authorId={data.id}
                  />
                </div>

                <div className="col-span-3">

                  {data?.posts.length > 0 ? data?.posts.map((post, index) => (
                    <div key={index} className="mb-4">
                      <FeaturedPost post={post} />
                    </div>
                  )) : (
                    <Typography className="mb-4 underLine" variant='h5' component='h1'> Sorry No Posts Found </Typography>
                  )}
                </div>

              </div>
            </main>
            </Box>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}

export async function getStaticPaths() {
  const blogsNames: {params: { blogName: string; }}[] = [];

  const data = await prisma.user.findMany({ select: { blogName: true } })

  for (let item of data) {
      blogsNames.push({ params: { blogName: item.blogName } })
  }

  return { paths: blogsNames, fallback: "blocking" };
}

export async function getStaticProps({params}: {  params: { blogName: string; }} ) {

  const data = await prisma.user.findFirst({
    where: { blogName: params.blogName },
    select: {
        about: true,
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profile: true,
        posts: {
            orderBy: { createdAt: "desc" },
            select: {
                backgroundImage: true,
                title: true,
                slug: true,
                description: true,
                createdAt: true,
                author: { select: { blogName: true } }
            }
        }
    }
});

const serializedData = {data: JSON.parse(JSON.stringify(data))}

  return { props: serializedData,  revalidate: 10 };
}