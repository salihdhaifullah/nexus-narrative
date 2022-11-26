import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { dislikePost, GetLikes, likePost, viewedPost } from '../../../api';
import { IFeaturedPostProps, IPostProps } from '../../../types/post';
import { IComment } from '../../../types/comment';

import MainFeaturedPost from '../../../components/MainFeaturedPost';
import FeaturedPost from '../../../components/FeaturedPost';
import Main from '../../../components/Main';
import Sidebar from '../../../components/Sidebar';

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
import Comments from '../../../components/Comments';


export default function Post({ data }: IPostProps) {
  const [liked, setIsLiked] = useState<boolean>(false)
  const [likes, setLikes] = useState<string[]>([])
  const [dislikes, setDislikes] = useState<string[]>([])

  const handelGetLikes = useCallback(async () => {
    if (!data.id) return;
    await GetLikes(data.id)
      .then((res) => {
        setLikes(res.data.likes.likes)
        setDislikes(res.data.likes.dislikes)
      })
      .catch((err) => { console.log(err) })
  }, [data.id])


  const init = useCallback(async () => {
    if (!data.id) return;
    await viewedPost(data.id)
      .then((res) => { console.log(res.data) })
      .catch((err) => { console.log(err) })
  }, [data.id])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    handelGetLikes()
  }, [liked, handelGetLikes])

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
              <Comments postId={data.id} />
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
      id: postData.id,
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