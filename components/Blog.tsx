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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Button, Chip, Typography } from '@mui/material';
import { IUser } from '../types/user';
import Image from 'next/image';
import plaseHolder from '../public/images/user-placeholder.png';

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

const myLoader = (url: string) => url;

export default function Blog({ content, about, socil, email, title, blogName, backgroundImageUrl, name, AvatarUrl, createdAt, tags, category }: IBlogProps) {
  const comment = {
    createdAt: 1666800365141,
    userName: "salih Hassan",
    content: "hello moomoo what are you doing",
    userId: 2
  }


  const [isServer, setIsServer] = React.useState<boolean>(typeof window === 'undefined');
  const [isFound, setIsFound] = React.useState<any>(null);
  const [user, setUser] = React.useState<IUser | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    if (!isServer) setIsFound(localStorage.getItem("user"));
    if (isFound) setUser(JSON.parse(isFound));
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

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg shadow-lg bg-white p-6">
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
                  className="px-3 py-2 text-sm hover:text-white border-blue-600 hover:bg-blue-600 text-blue-600 border rounded">
                  Cancel
                </Button>
              </div>
            </div>


            <div className="h-fit p-4 rounded-md bg-white shadow-md">
              <div className="mb-2 flex">

                {isOpen && (
                  <span className="relative z-10">
                    <div className="absolute flex flex-col top-10 rounded-md bg-white transition-all shadow-md p-4">
                      <span
                        className="cursor-pointer hover:bg-gray-200 px-3 py-[6px] text-base  mb-2">Delete</span>
                      <span
                        className="cursor-pointer hover:bg-gray-200 px-3 py-[6px] text-base">Update</span>
                    </div>
                  </span>
                )}
                {/* need to work on Avatar commponnent and comment funcshnalty */}
                <MoreVertIcon onClick={() => setIsOpen(!isOpen)} className="cursor-pointer" />

                <Image
                  className='rounded-full object-fill'
                  src={plaseHolder}
                  alt="Picture of the author"
                  width={60}
                  height={60}
                />
                <span className="text-base text-gray-700 mr-2 flex-1 ml-6">By {comment.userName}</span>
                <span className="text-sm text-gray-500">{moment(comment.createdAt).format('ll')}</span>
              </div>
              <hr className="mb-3" />

              <span className="text-base text-gray-700">{comment.content}</span>
            </div>

          </div>

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