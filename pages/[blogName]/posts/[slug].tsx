import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

import { dislikePost, GetLikes, likePost, viewedPost } from '../../../api';
import { IFeaturedPostProps, IPostProps } from '../../../types/post';

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
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0);



  const handelGetLikes = useCallback(async () => {
    if (!data.id) return;
    await GetLikes(data.id)
      .then((res) => {
        setLikes(res.data.likes)
        setDislikes(res.data.dislikes)
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
  }, [handelGetLikes])

  const handelLike = async () => {

    await likePost(data.id)
      .then((res) => {

        handelGetLikes()
      })
      .catch((err) => { console.log(err) })
  }

  const handelDisLike = async () => {

    await dislikePost(data.id)
      .then((res) => {
        handelGetLikes()
      })
      .catch((err) => { console.log(err) })
  }

  const getKeywords = (): string => {
    let text = "";

    for (let tag of data.tags) {
      text = text + tag.name + ", "
    }

    text = text + data.category;

    return text;
  }

  return (
    <>
      {data ? (
        <>
          <Head>
            <title>{data.title}</title>
            <meta name="description" content={data.description}></meta>
            <meta name="keywords" content={getKeywords()}></meta>
          </Head>

          <Box className="min-w-[95vw] p-4 mb-10 mt-4" >
            <CssBaseline />
            <article>
              <MainFeaturedPost image={`/uploads/${data.backgroundImage}`} title={data.title} />

              <Grid className="inline-flex flex-row flex-wrap-reverse md:flex-nowrap gap-2">

                <Main post={data.content} />

                <Sidebar
                  description={data.about}
                  email={data.email}
                  name={data.name}
                  AvatarUrl={data.AvatarUrl}
                  authorId={data.authorId}
                  blogName={data.blogName}
                  category={data.category}
                  createdAt={data.createdAt}
                />

              </Grid>


              <Grid className="flex-col mt-20 border p-4 w-fit rounded-md border-blue-600 bg-blue-100 shadow-lg shadow-blue-400 hover:shadow-blue-400 hover:shadow-xl">
                <Typography variant='h5' component="h2">Did You Find This Content Usefully ?</Typography>
                <div className="mt-4 flex flex-row  gap-2">
                  <Button className="border border-gray-800 rounded-md bg-blue-300 hover:bg-blue-400" onClick={handelLike} startIcon={<ThumbUpIcon />}>{likes}</Button>
                  <Button className="border border-gray-800 rounded-md bg-blue-300 hover:bg-blue-400" onClick={handelDisLike} startIcon={<ThumbDownAltIcon />}>{dislikes}</Button>
                </div>
              </Grid>

              <Grid container spacing={4} className="flex my-20 justify-center items-center">
                {data.tags.map((item, index) => (
                  <Link key={index} href={`/search/?tag=${item.name}`}>
                    <Chip label={"#" + item.name} className="mr-1 text-base link" variant="outlined" />
                  </Link>
                ))}
              </Grid>

              <hr className='mt-20 mb-20' />


              <div className='flex mb-6 justify-start items-start'>
                <Typography variant='h5' className="underLine" component="h2">Comments Section</Typography>
              </div>

              <section className="grid md:grid-cols-2 grid-cols-1  gap-4">
                <Comments postId={data.id} />
              </section>

              <Box className="mt-[200px] flex-col flex gap-20">


                <Box className="flex flex-col min-w-full">
                  {data.posts.length > 0 ?
                    <>
                      <div className='flex mb-2 justify-start items-start'>
                        <Typography className="mb-4 underLine" variant='h5' component='h1'> Posts From The author </Typography>
                      </div>

                      <Box className="gap-4 grid w-full grid-cols-1 sm:grid-cols-2 ">

                        {data.posts.map((post, index) => (
                          <div key={index} className="w-full">
                            <FeaturedPost post={post} />
                          </div>
                        ))}

                      </Box>

                    </>
                    : (null)}
                </Box>


                <Box className="flex flex-col min-w-full">

                  {data.PostsRelated.length > 0 ?
                    <>

                      <div className='flex mb-2 justify-start items-start'>
                        <Typography variant='h5' className="my-4 underLine" component='h1'> Posts Related to the topic </Typography>
                      </div>

                      <Box className="gap-4 grid w-full grid-cols-1 sm:grid-cols-2 ">

                        {data.PostsRelated.map((post, index) => (
                          <div key={index} className="w-full ">
                            <FeaturedPost post={post} />
                          </div>
                        ))}

                      </Box>

                    </>
                    : (null)}

                </Box>

              </Box>

            </article>
          </Box>

        </>
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
      description: true,
      author: {
        select: {
          posts: {
            where: { NOT: [{ slug: params.slug }] },
            take: 5,
            orderBy: { createdAt: "desc" },
            select: {
              backgroundImage: true,
              title: true,
              slug: true,
              createdAt: true,
              author: { select: { blogName: true } },
              description: true
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
    where: {
      NOT: [{ slug: params.slug }],
      category: { name: postData?.category.name || "" }
    },
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      backgroundImage: true,
      title: true,
      slug: true,
      createdAt: true,
      author: { select: { blogName: true } },
      description: true
    }
  });



  let serializedData: IPostProps | { data: null } = { data: null };

  if (!postData) return;
  serializedData = {
    data: {
      id: postData.id,
      description: postData.description,
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