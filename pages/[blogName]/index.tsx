import React from 'react'
import { getAllBlogsName, getBlogDataForHomePage } from '../../controllers'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FeaturedPost from '../../components/FeaturedPost';
import Sidebar from '../../components/Sidebar';
import { Typography } from '@mui/material';



const theme = createTheme();

export default function index({blogData}: any) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" >
        <main>
          <div className="grid grid-cols-5 grid-flow-dense gap-10 my-16">

            <div className="col-span-3">
              <div className='flex justify-center items-center mt-14 mb-8'>
                <Typography className="mb-4 underLine" variant='h5' component='h1'> Posts From The author </Typography>
              </div>
                {blogData.authorPosts.posts.length > 0 ? blogData.authorPosts.posts.map((post) => (
                  <div key={post.title} className="mb-4">
                    <FeaturedPost key={post.title} post={post} blogName={blogData.blogName}/>
                  </div>
                )) : (
                  <Typography className="mb-4 underLine" variant='h5' component='h1'> Sorry No Posts Found </Typography>
                )}
            </div>

            <div className="col-span-2">
              <Sidebar
                title="about"
                description={blogData.authorPosts.data?.about}
                social={blogData.authorPosts.data.socil}
                email={blogData.authorPosts.data.email}
                name={blogData.authorPosts.data.firstName + " " + blogData.authorPosts.data.lastName}
                AvatarUrl={blogData.authorPosts.data.Avter.fileUrl}
                authorId={blogData.authorPosts.data.id}
              />
            </div>

          </div>
        </main>
      </Container >
    </ThemeProvider >
  );
}

export async function getStaticPaths() {
  const paths = await getAllBlogsName();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const blogData = await getBlogDataForHomePage(params.blogName);
  return {
    props: {
      blogData,
    },
  };
}