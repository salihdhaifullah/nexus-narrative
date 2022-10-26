import * as React from 'react';
import { useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import moment from 'moment';
import { Button, Chip, Typography } from '@mui/material';
import { IUser } from '../types/user';
import { Avatar } from '@mui/material';



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
  name: string;
  AvatarUrl: string;
  createdAt: string;
  tags: {
    name: string;
  }[];
  category: string;
}

export default function Blog({ content, about, socil, email, title, blogName, backgroundImageUrl, name, AvatarUrl, createdAt, tags, category }: IBlogProps) {
  const comment = {
    createdAt: 1666800365141,
    userName: "salih Hassan",
    content: "hello moomoo what are you doing",
    userId: 2
  }

  const isServer: boolean = typeof window !== 'undefined';

  let isFound: null | string = null;
  let user: IUser | null = null;

  useEffect(() => {
    if (!isServer) isFound = localStorage.getItem("user")
    if (isFound) {
      user = JSON.parse(isFound)
      console.log(user);
    }

  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <main>
          <MainFeaturedPost image={backgroundImageUrl} title={title} />
          <Typography className="text-lg">published at: {createdAt}</Typography>
          <Typography className="text-lg">category: {category}</Typography>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            <Main title={`From the ` + blogName} post={content} />
            <Sidebar
              title="about"
              description={about}
              social={socil}
              email={email}
              name={name}
              AvatarUrl={AvatarUrl}
            />
          </Grid>

          <Grid>
            <div className="min-w-full rounded-lg shadow-lg bg-white p-6">
              <div className="mb-2">
                <label htmlFor="comment" className="text-lg text-gray-600">Add a comment</label>
                <textarea
                  id="comment"
                  className="min-h-[10rem] min-w-full p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1"
                  name="comment"
                  placeholder=""></textarea>
              </div>
              <div className="justify-evenly flex items-center">
                <Button className="px-3 py-2 hover:text-blue-600 hover:border-blue-600 hover:border hover:bg-white text-sm text-white bg-blue-600 rounded">
                  Comment
                </Button>
                <Button
                  className="px-3 py-2 text-sm hover:text-white hover:bg-blue-600 text-blue-600 border border-blue-500 rounded">
                  Cancel
                </Button>
              </div>
            </div>


            <div>
              <div className="mb-2 flex">

                <span className="relative">
                  <div className="absolute flex flex-col rounded-md bg-white transition-all shadow-md p-4">
                    <span
                      className="cursor-pointer hover:bg-gray-200 px-3 py-[6px] text-base  mb-2">Delete</span>
                    <span
                      className="cursor-pointer hover:bg-gray-200 px-3 py-[6px] text-base">Update</span>
                  </div>
                </span>
                <Avatar className="object-fill max-w-8 max-h-8 sm:max-w-10 sm:max-h-10 lg:max-w-12 lg:max-h-12 rounded-full"></Avatar>
                <span className="text-base text-gray-700 mr-2 flex-1 ml-6">By {comment.userName}</span>
                <span className="text-sm text-gray-500">{moment(comment.createdAt).format('ll')}</span>
              </div>
              <hr className="mb-3" />

              <span className="text-base text-gray-700">{comment.content}</span>
            </div>
          </Grid>

          <Container className="mt-20">
            <Grid container spacing={4} className="flex justify-center items-center my-4">
              {tags && tags.map((item, index) => (
                <Chip key={index} label={item.name} className="mr-1" variant="outlined" />
              ))}
            </Grid>
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

      </Container >
    </ThemeProvider >
  );
}