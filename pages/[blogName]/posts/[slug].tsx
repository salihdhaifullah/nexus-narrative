import { useEffect, useCallback } from 'react';
import Head from 'next/head';
import { viewedPost } from '../../../api';
import { IBLogProps, IPostProps } from '../../../types/post';
import MainPost from '../../../components/MainPost';
import Post from '../../../components/Post';
import Main from '../../../components/Main';
import Details from '../../../components/Details';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'
import prisma from '../../../libs/prisma';
import moment from 'moment';
import Comments from '../../../components/Comments';
import IsUseful from '../../../components/IsUseful';
import Tags from '../../../components/Tags';


export default function Index({ data }: { data: IBLogProps }) {

  const DetailsProps = {
    description: data.about,
    email: data.email,
    name: data.name,
    AvatarUrl: data.AvatarUrl,
    authorId: data.authorId,
    blogName: data.blogName,
    category: data.category,
    createdAt: data.createdAt
  }

  const init = useCallback(async () => {
    if (!data.id) return;
    await viewedPost(data.id)
  }, [data.id])

  useEffect(() => {
    init()
  }, [init])

  const getKeywords = (): string => {
    let text = "";

    for (let tag of data.tags) {
      text = text + tag.name + ", "
    }

    text = text + data.category;
    return text;
  }

  return data ? (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description}></meta>
        <meta name="keywords" content={getKeywords()}></meta>
      </Head>

      <article className='w-full block max-w-full p-4 mb-10 mt-4' >
        <MainPost image={data.backgroundImage} title={data.title} />

        <Grid className="inline-flex make-width-fit flex-row flex-wrap-reverse lg:flex-nowrap gap-2">
          <Main post={data.content} />

          <Details {...DetailsProps} />
        </Grid>

        <IsUseful postId={data.id} />
        <Tags tags={data.tags} />
        <Comments postId={data.id} />

        <Box className="mt-[200px] flex-col flex gap-20">

          <Box className="flex flex-col min-w-full">
            {data.posts.length < 1 ? null : (
              <Box>
                <div className='flex mb-2 justify-start items-start'>
                  <Typography className="mb-4 underLine" variant='h5' component='h1'> Posts From The author </Typography>
                </div>

                <Box className="gap-4 grid w-full grid-cols-1 sm:grid-cols-2 ">

                  {data.posts.map((post, index) => (
                    <div key={index} className="w-full"> <Post post={post} /> </div>
                  ))}

                </Box>
              </Box>
            )}
          </Box>


          <Box className="flex flex-col min-w-full">

            {data.PostsRelated.length < 1 ? null : (
              <Box>
                <div className='flex mb-2 justify-start items-start'>
                  <Typography variant='h5' className="my-4 underLine" component='h1'> Posts Related to the topic </Typography>
                </div>

                <Box className="gap-4 grid w-full grid-cols-1 sm:grid-cols-2 ">
                  {data.PostsRelated.map((post, index) => (
                    <div key={index} className="w-full ">
                      <Post post={post} />
                    </div>
                  ))}
                </Box>
              </Box>
            )}

          </Box>
        </Box>
      </article>

    </>
  ) : <CircularProgress />
}





export async function getStaticPaths() {
  const slugs: { params: { slug: string, blogName: string } }[] = []

  const data = await prisma.post.findMany({ select: { slug: true, author: { select: { blogName: true } } } });

  for (let item of data) {
    slugs.push({ params: { slug: item.slug, blogName: item.author.blogName } })
  }

  return {
    paths: slugs,
    fallback: "blocking"
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



  let serializedData: { data: IBLogProps } | { data: null } = { data: null };

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
      AvatarUrl: postData.author.profile || "/images/user-placeholder.png",
      createdAt: moment(postData.createdAt).format("ll"),
      tags: postData.tags,
      category: postData.category.name,
      postId: postData.id,
      slug: params.slug,
      posts: postData.author.posts as IPostProps[],
      PostsRelated: PostsRelated as IPostProps[],
      authorId: postData.author.id
    }
  }

  const data = JSON.parse(JSON.stringify(serializedData.data))

  return { props: { data }, revalidate: 10 };
}
