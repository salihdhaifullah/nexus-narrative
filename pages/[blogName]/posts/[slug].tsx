import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { CreateComment, dislikePost, GetComments, GetLikes, likePost, updateComment } from '../../../api';
import { IFeaturedPostProps, IPostProps } from '../../../types/post';
import { IComment } from '../../../types/comment';

import MainFeaturedPost from '../../../components/MainFeaturedPost';
import FeaturedPost from '../../../components/FeaturedPost';
import Main from '../../../components/Main';
import Sidebar from '../../../components/Sidebar';
import Comment from '../../../components/Comment';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import prisma from '../../../libs/prisma';
import moment from 'moment';


export default function Post({ data }: IPostProps) {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [commentState, setComment] = useState("");
  const [comments, setComments] = useState<IComment[]>([]);
  const [changeComments, setChangeComments] = useState(false);
  const [idToUpdate, setIdToUpdate] = useState<number | null>(null)
  const [liked, setIsLiked] = useState<boolean>(false)
  const [likes, setLikes] = useState<string[]>([])
  const [dislikes, setDislikes] = useState<string[]>([])

  const handelGetLikes = useCallback(async () => {
    await GetLikes(data.slug)
      .then((res) => {
        setLikes(res.data.likes.likes)
        setDislikes(res.data.likes.dislikes)
      })
      .catch((err) => { console.log(err) })
  }, [data.slug])

  const handelGetComments = useCallback(async () => {
    await GetComments(data.slug)
      .then((res) => {
        setComments(res.data.comments.comments)
        console.log(res.data.comments)
      })
      .catch((err) => { console.log(err) })
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

    if (!idToUpdate) {
      await CreateComment({ postId: Number(data.postId), comment: commentState })
        .then((res) => { })
        .catch((err) => { })
    } else {
      await updateComment(idToUpdate, commentState)
        .then((res) => { })
        .catch((err) => { })
      setIdToUpdate(null)
    }
    setChangeComments(!changeComments)
    setComment("")
  }

  const scrollToForm = () => {
    if (formRef?.current && formRef.current?.offsetLeft && formRef.current?.offsetTop) {
      scroll(formRef.current.offsetLeft, (formRef.current.offsetTop - 200));
    }
  }

  const handelLike = async () => {
    await likePost(data.slug)
      .then((res) => { })
      .catch((err) => { console.log(err) })
    setIsLiked(!liked)
  }

  const handelDisLike = async () => {
    await dislikePost(data.slug)
      .then((res) => { })
      .catch((err) => { console.log(err) })
    setIsLiked(!liked)
  }

  return (
    <>
      <Head>
        <title>hello-world</title>
      </Head>
      {data ? (
        <Box className="min-w-[100vw] p-4 my-10" >
          <CssBaseline />
          <article>
            <MainFeaturedPost image={`/uploads/${data.backgroundImage}`} title={data.title} />
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


            <Grid className="flex-col mt-10">
              <Typography variant='h5' component="h2">Did You Find This Content Usefully ?</Typography>
              <div className="mt-4 flex flex-row gap-2">
                <Button className="border border-gray-800 rounded-md bg-blue-300 hover:bg-blue-400" onClick={handelLike} startIcon={<ThumbUpIcon />}>{likes.length && likes.length}</Button>
                <Button className="border border-gray-800 rounded-md bg-blue-300 hover:bg-blue-400" onClick={handelDisLike} startIcon={<ThumbDownAltIcon />}>{dislikes.length && dislikes.length}</Button>
              </div>
            </Grid>


            <hr className='mt-20 mb-20' />

            <div className='flex mb-6 justify-start items-start'>
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
                {comments?.length ? comments.map((comment, index) => (
                  <Comment comment={comment}
                    setChangeComments={setChangeComments}
                    changeComments={changeComments}
                    setIdToUpdate={setIdToUpdate}
                    scrollToForm={scrollToForm} key={index} />
                )) : null}
              </div>


            </div>

            <Container className="mt-20">


              <Grid container spacing={4} className="flex mb-20 justify-center items-center my-4">
                {data.tags.map((item, index) => (
                  <Link key={index} href={`/search/?tag=${item.name}`}>
                    <Chip label={item.name} className="mr-1 link" variant="outlined" />
                  </Link>
                ))}
              </Grid>



              <Grid container spacing={4} className="mb-20" >
                {data.posts.length > 0 ?
                  <>
                    <div className='flex mb-2 justify-start items-start'>
                      <Typography className="mb-4 underLine" variant='h5' component='h1'> Posts From The author </Typography>
                    </div>
                    {data.posts.map((post, index) => (
                      <div key={index} className="mb-4 w-full">
                        <FeaturedPost post={post} />
                      </div>
                    ))}
                  </>
                  : (null)}
              </Grid>


              <Grid container spacing={4}>
                {data.PostsRelated.length > 0 ?
                  <>
                    <div className='flex mb-2 justify-start items-start'>
                      <Typography variant='h5' className="my-4 underLine" component='h1'> Posts Related to the topic </Typography>
                    </div>
                    {data.PostsRelated.map((post, index) => (
                      <div key={index} className="mb-4 w-full">
                        <FeaturedPost post={post} />
                      </div>
                    ))}
                  </>
                  : (null)}
              </Grid>

            </Container>

          </article>
        </Box>
      ) : (
        <CircularProgress />
      )}
    </>
  );
}





export async function getStaticPaths() {
  const slugs: { params: { slug: string, blogName: string } }[] = []

  const data = await prisma.post.findMany({ select: { slug: true, author: { select: { blogName: true } } } });

  for (let item of data) {
    slugs.push({ params: { slug: item.slug, blogName: item.author.blogName } })
  }

  return {
    paths: slugs,
    fallback: false
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const postData = await prisma.post.findFirst({
    where: { slug: params.slug },
    select: {
      id: true,
      content: true,
      title: true,
      author: {
        select: {
          posts: {
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
              backgroundImage: true,
              title: true,
              slug: true,
              createdAt: true,
              author: { select: { blogName: true } }
            },
          },
          email: true,
          firstName: true,
          lastName: true,
          blogName: true,
          id: true,
          profile: true,
          about: true
        },
      },
      tags: { select: { name: true } },
      category: { select: { name: true } },
      createdAt: true,
      backgroundImage: true
    }
  });


  const PostsRelated = await prisma.post.findMany({
    take: 5,
    where: { category: { name: postData?.category.name || " " } },
    orderBy: { createdAt: "desc" },
    select: {
      backgroundImage: true,
      title: true,
      slug: true,
      createdAt: true,
      author: { select: { blogName: true } }
    }
  });



  let serializedData: IPostProps | { data: null } = { data: null };

  if (!postData) return;
  serializedData = {
    data: {
      content: postData.content,
      about: postData.author.about || "Not Found",
      email: postData.author.email,
      title: postData.title,
      blogName: postData.author.blogName as string,
      backgroundImage: postData.backgroundImage,
      name: postData.author.firstName + " " + postData.author.lastName,
      AvatarUrl: postData.author.profile ? `/uploads/${postData.author.profile}` : "/images/user-placeholder.png",
      createdAt: moment(postData.createdAt).format("ll"),
      tags: postData.tags,
      category: postData.category.name,
      postId: postData.id,
      slug: params.slug,
      posts: postData.author.posts as IFeaturedPostProps[],
      PostsRelated: PostsRelated as IFeaturedPostProps[],
      authorId: postData.author.id
    }
  }

  const data = JSON.parse(JSON.stringify(serializedData.data))

  return { props: { data } };
}