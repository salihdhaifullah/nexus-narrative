import React from 'react'
import { getAllBlogsName, getBlogData } from '../../controllers'
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FeaturedPost from '../../components/FeaturedPost';
import Sidebar from '../../components/Sidebar';
import { Typography } from '@mui/material';



const theme = createTheme();

export default function index({ blogData }: any) {
  console.log(blogData)
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
                {blogData.dataItem.posts.length > 0 ? blogData.dataItem.posts.map((post) => (
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
                description={blogData.dataItem.data?.about}
                social={blogData.dataItem.data.socil}
                email={blogData.dataItem.data.email}
                name={blogData.dataItem.data.firstName + " " + blogData.dataItem.data.lastName}
                AvatarUrl={blogData.dataItem.data.Avter.fileUrl}
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
  const blogData = await getBlogData(params.blogName);
  return {
    props: {
      blogData,
    },
  };
}