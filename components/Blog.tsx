import { useState, useEffect, useCallback, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Comment from './Comment';
import { Button, Chip, CircularProgress, Typography } from '@mui/material';
import { CreateComment, dislikePost, GetComments, GetLikes, likePost, updateComment } from '../api';
import Link from 'next/link';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import { IBLogProps, IPostProps } from '../types/post';
import { IComment } from '../types/comment';

const theme = createTheme();


interface IProps {
  data: IBLogProps
}


export default function Blog({ data }: IProps) {
  console.log(data)
  const [commentState, setComment] = useState("");

  const [comments, setComments] = useState<IComment[]>([]);
  const [changeComments, setChangeComments] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState<number | null>(null)
  const [liked, setIsLiked] = useState<boolean>(false)
  const formRef = useRef<HTMLDivElement | null>(null);
  const [likes, setLikes] = useState<string[]>([])
  const [dislikes, setDislikes] = useState<string[]>([])

  const handelGetLikes = useCallback(async () => {
    await GetLikes(data.slug).then((res) => {
      console.log(res.data.likes);
      setLikes(res.data.likes.likes)
      setDislikes(res.data.likes.dislikes)
    }).catch((err) => {
      console.log(err);
    })
  }, [data.slug])

  const handelGetComments = useCallback(async () => {
    await GetComments(data.slug).then((res) => {
      setComments(res.data.comments.comments)
      console.log(res.data.comments)
    }).catch((err) => {
      console.log(err);
    })
  }, [data.slug])

  useEffect(() => {
    handelGetLikes()
  }, [liked, handelGetLikes])

  useEffect(() => {
    handelGetComments()
  }, [changeComments, handelGetComments])

  useEffect(() => {
    if (idToUpdate) {
      const content: string | undefined = comments.find((c: IComment) => c.id === idToUpdate)?.content;
      if (content) setComment(content)
    }
  }, [comments, idToUpdate])

  const handelCreateOrUpdateComment = async () => {
    if (!commentState) return;
    if (idToUpdate === null) {
      await CreateComment({ postId: Number(data.postId), comment: commentState }).then((res) => {
      }).catch((err: any) => {
      })
      setChangeComments(!changeComments)
    } else {
      await updateComment(idToUpdate, commentState).then((res) => {
      }).catch((err: any) => {
      })
      setChangeComments(!changeComments)
      setIdToUpdate(null)
    }
    setComment("")
  }

  const scrollToForm = () => {
    if (formRef?.current && formRef.current?.offsetLeft && formRef.current?.offsetTop) {
      scroll(formRef.current.offsetLeft, (formRef.current.offsetTop - 200));
    }
  }

  const handelLike = async () => {
    await likePost(data.slug).then((res) => {
    }).catch((err: any) => {
      console.log(err)
    })
    setIsLiked(!liked)
  }

  const handelDisLike = async () => {
    await dislikePost(data.slug).then((res) => {
    }).catch((err: any) => {
      console.log(err)
    })
    setIsLiked(!liked)
  }


  return !data ? (
    <CircularProgress />
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" >
        <main>
          <MainFeaturedPost image={data.backgroundImage} title={data.title} />
          <Typography className="text-lg">published at: {data.createdAt}</Typography>
          <Typography className="text-lg" component="div">
            category:
            <Link href={`/search?category=${data.category}`}>
              <a className="text-lg ml-1 font-bold link">{data.category}</a>
            </Link>
          </Typography>
          <Grid container spacing={5} sx={{ mt: 3 }}>

            <Main blogName={data.blogName} post={data.content} />
            <Sidebar
              description={data.about}
              email={data.email}
              name={data.name}
              AvatarUrl={data.AvatarUrl}
              authorId={data.authorId}
            />

          </Grid>


          <Grid container spacing={5} sx={{ mt: 3 }} className="flex-col mt-10">
            <Typography variant='h5' component="h2">Did You Find This Content Usefully ?</Typography>
            <div className="mt-4">
              <Button className="" onClick={handelLike} startIcon={<ThumbUpIcon />}>like</Button>
              {likes.length && likes.length}
              <Button className="" onClick={handelDisLike} startIcon={<ThumbDownAltIcon />}>disLike</Button>
              {dislikes.length && dislikes.length}
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
                  onClick={() => setComment("")}
                  className="px-3 py-2 text-sm hover:text-white border-blue-600 hover:bg-blue-600 text-blue-600 border rounded">
                  Cancel
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
              {comments?.length && comments.map((comment, index) => (
                <Comment comment={comment}
                  setChangeComments={setChangeComments}
                  changeComments={changeComments}
                  setIdToUpdate={setIdToUpdate}
                  scrollToForm={scrollToForm} key={index} />
              ))}
            </div>


          </div>

          <Container className="mt-20">
            <Grid container spacing={4} className="flex justify-center items-center my-4">
              {data.tags && data.tags.map((item, index) => (
                <Link key={index} href={`/search/?tag=${item.name}`}>
                  <Chip label={item.name} className="mr-1 link" variant="outlined" />
                </Link>
              ))}
            </Grid>
            <div className='flex justify-center items-center mt-14 mb-8'>
              <Typography className="mb-4 underLine" variant='h5' component='h1'> Posts From The author </Typography>
            </div>
            <Grid container spacing={4}>
              {data.posts.length > 0 ? data.posts.map((post, index) => (
                <div key={index} className="mb-4 w-full">
                  <FeaturedPost post={post} />
                </div>
              )) : (
                <Typography className="mb-4 underLine" variant='h5' component='h1'> Sorry No Posts Found </Typography>
              )}
            </Grid>
            <div className='flex justify-center items-center  my-8'>
              <Typography variant='h5' className="my-4 underLine" component='h1'> Posts Related to the topic </Typography>
            </div>
            <Grid container spacing={4} >
              {data.PostsRelated.length > 0 ? data.PostsRelated.map((post, index) => (
                <div key={index} className="mb-4 w-full">
                  <FeaturedPost post={post} />
                </div>
              )) : (
                <Typography className="mb-4 underLine" variant='h5' component='h1'> Sorry No Posts Found </Typography>
              )}
            </Grid>
          </Container>

        </main>

      </Container >
    </ThemeProvider >
  );
}