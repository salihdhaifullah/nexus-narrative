import { useEffect } from 'react'
import { getBlogDataForHomePage } from '../../controllers'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import FeaturedPost from '../../components/FeaturedPost';
import Sidebar from '../../components/Sidebar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { GetAllBlogsNames } from '../../api';


const theme = createTheme();

interface IPost {
  createdAt: Date;
  backgroundImageUrl: string;
  slug: string;
  title: string;
}


export default function Index({ blogData }: any) {
  const init = async () => {

  }

  useEffect(() => {
    init()
  }, [])
  return (
    <>
      {blogData ? (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="lg" >
            <main>
              <div className="grid grid-cols-5 grid-flow-dense gap-10 my-16">

                <div className="col-span-3">
                  <div className='flex justify-center items-center mt-14 mb-8'>
                    <Typography className="mb-4 underLine" variant='h5' component='h1'> Posts From The author </Typography>
                  </div>
                  {blogData.authorPosts.posts.length > 0 ? blogData.authorPosts.posts.map((post: IPost) => (
                    <div key={post.title} className="mb-4">
                      <FeaturedPost key={post.title} post={post} blogName={blogData.blogName} />
                    </div>
                  )) : (
                    <Typography className="mb-4 underLine" variant='h5' component='h1'> Sorry No Posts Found </Typography>
                  )}
                </div>

                <div className="col-span-2">
                  <Sidebar
                    description={blogData.authorPosts.data?.about}
                    social={blogData.authorPosts.data.socil}
                    email={blogData.authorPosts.data.email}
                    name={blogData.authorPosts.data.firstName + " " + blogData.authorPosts.data.lastName}
                    AvatarUrl={blogData.authorPosts.data?.Avter?.fileUrl || ""}
                    authorId={blogData.authorPosts.data.id}
                  />
                </div>

              </div>
            </main>
          </Container >
        </ThemeProvider >
      ) : (
        <CircularProgress />
      )}
    </>
  );
}

export async function getStaticPaths() {
  const paths = await (await GetAllBlogsNames()).data.blogName;
  return {
    paths,
    fallback: false,
  };
}

interface IGetStaticProps {
  params: {
    blogName: string;
  }
}

export async function getStaticProps(props: IGetStaticProps) {
  const blogData = await getBlogDataForHomePage(props.params.blogName);
  console.log(props.params.blogName)
  return {
    props: {
      blogData,
    },
  };
}