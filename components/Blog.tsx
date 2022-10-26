import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import post1 from './blog-post1';
import post2 from './blog-post2';
import post3 from './blog-post3';
import { Typography } from '@mui/material';



const mainFeaturedPost = {
  title: 'Title of a longer featured blog post',
  description:
    "Multiple lines of text that form the lede, informing new readers quickly and efficiently about what's most interesting in this post's contents.",
  image: 'https://source.unsplash.com/random',
  imageText: 'main image description',
  linkText: 'Continue reading…',
};

const featuredPosts = [
  {
    title: 'Featured post',
    date: 'Nov 12',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageLabel: 'Image Text',
  },
  {
    title: 'Post title',
    date: 'Nov 11',
    description:
      'This is a wider card with supporting text below as a natural lead-in to additional content.',
    image: 'https://source.unsplash.com/random',
    imageLabel: 'Image Text',
  },
];


const theme = createTheme();

interface IBlogProps {
  content: string;
  about: string;
  socil: {
    name: string;
    link: string;
  }[]
  email: string;
  title: string;
  blogName: string;
  backgroundImageUrl: string;
}

export default function Blog({content, about, socil, email, title, blogName, backgroundImageUrl}: IBlogProps) {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <main>
          <MainFeaturedPost image={backgroundImageUrl} title={title}/>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title={`From the ` + blogName} post={content} />
            <Sidebar
              title="about"
              description={about}
              social={socil}
              email={email}
            />
          </Grid>

          <Container>
            <Typography className="mb-4" variant='h5' component='h1'> Posts From The author </Typography>
            <Grid container spacing={4}>
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
            </Grid>

            <Typography variant='h5' className="my-4" component='h1'> Posts Related to the topic </Typography>
            <Grid container spacing={4} >
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
            </Grid>
          </Container>

        </main>

      </Container>
    </ThemeProvider>
  );
}