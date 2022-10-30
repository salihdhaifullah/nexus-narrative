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
import Comment from './Comment';
import { Button, Chip, Typography } from '@mui/material';
import { CreateComment, dislikePost, likePost, updateComment } from '../api';
import Link from 'next/link';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';

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
  postId: number;

  comments: {
    author: {
      Avter: {
        fileUrl: string;
      }
      firstName: string;
      lastName: string;
    }
    authorId: number;
    content: string;
    createdAt: Date;
    id: number;
  }[]
  slug: string;
}

export default function Blog({ slug, comments, postId, content, about, socil, email, title, blogName, backgroundImageUrl, name, AvatarUrl, createdAt, tags, category }: IBlogProps) {

  const [commentState, setComment] = React.useState("");
  const [idToUpdate, setIdToUpdate] = React.useState<number | null>(null)
  const formRef = React.useRef<HTMLDivElement>();


  const handelCreateOrUpdateComment = async () => {
    if (!commentState) return;
    if (idToUpdate === null) {
      await CreateComment({ postId: Number(postId), comment: commentState }).then((res) => {
      }).catch((err: any) => {
      })
    } else {
      await updateComment(idToUpdate, commentState).then((res) => {
      }).catch((err: any) => {
      })
    }
    setComment("")
  }

  const scrollToForm = () => {
    if (formRef?.current && formRef.current?.offsetLeft && formRef.current?.offsetTop) {
      scroll(formRef.current.offsetLeft, (formRef.current.offsetTop - 200));
    }
  }
  const HandelCancel = () => {
    setComment("")
  }
  const handelSearchByTags = (tag: string) => {

  }

  const hnadelLike = async () => {
    await likePost(slug).then((res) => {
    }).catch((err: any) => {
      console.log(err)
    })
  }

  const hnadelDisLike = async () => {
    await dislikePost(slug).then((res) => {
    }).catch((err: any) => {
      console.log(err)
    })
  }


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" >
        <main>
          <MainFeaturedPost image={backgroundImageUrl} title={title} />
          <Typography className="text-lg">published at: {createdAt}</Typography>
          <Typography className="text-lg" component="div">
            category:
            <Link href={`/search?category=${category}`}>
              <a className="text-lg ml-1 font-bold link">{category}</a>
            </Link>
          </Typography>

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


          <Grid container spacing={5} sx={{ mt: 3 }} className="flex-col mt-10">
            <Typography variant='h5' component="h2">Did You Find This Content Usefully ?</Typography>
            <div className="mt-4">
              <Button className="" onClick={hnadelLike} startIcon={<ThumbUpIcon />}>like</Button>
              <Button className="" onClick={hnadelDisLike} startIcon={<ThumbDownAltIcon />}>disLike</Button>
            </div>
          </Grid>


          <hr className='mt-20 mb-20' />
          <div className='flex mb-20 justify-center items-center'>
            <Typography variant='h5' className="underLine" component="h2">Comments Section</Typography>
            <hr />
          </div>
          <div className="grid lg:grid-cols-2 grid-cols-1  gap-4">

            <div className="rounded-lg h-fit shadow-lg bg-white p-6" ref={formRef}>
              <div className="mb-2">
                <label htmlFor="comment" className="text-lg text-gray-600">Add a comment</label>
                <textarea
                  value={commentState}
                  onChange={(event) => setComment(event.target.value)}
                  id="comment"
                  className="min-h-[10rem] min-w-full p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1"
                  name="comment"
                  placeholder=""></textarea>
              </div>
              <div className="justify-evenly flex items-center">
                <Button onClick={handelCreateOrUpdateComment} className="px-3 py-2 hover:text-blue-600 hover:border-blue-600 hover:border hover:bg-white text-sm text-white bg-blue-600 rounded">
                  Comment
                </Button>
                <Button
                  onClick={HandelCancel}
                  className="px-3 py-2 text-sm hover:text-white border-blue-600 hover:bg-blue-600 text-blue-600 border rounded">
                  Cancel
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
              {comments.map((comment, index) => (
                <Comment comment={comment} setIdToUpdate={setIdToUpdate} scrollToForm={scrollToForm} key={index} />
              ))}
            </div>


          </div>

          <Container className="mt-20">
            <Grid container spacing={4} className="flex justify-center items-center my-4">
              {tags && tags.map((item, index) => (
                <Chip key={index} label={item.name} className="mr-1 link" variant="outlined" onClick={() => handelSearchByTags(item.name)} />
              ))}
            </Grid>
            <div className='flex justify-center items-center mt-14 mb-8'>
              <Typography className="mb-4 underLine" variant='h5' component='h1'> Posts From The author </Typography>
            </div>
            <Grid container spacing={4}>
              {featuredPosts.map((post) => (
                <FeaturedPost key={post.title} post={post} />
              ))}
            </Grid>
            <div className='flex justify-center items-center  my-8'>
              <Typography variant='h5' className="my-4 underLine" component='h1'> Posts Related to the topic </Typography>
            </div>
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