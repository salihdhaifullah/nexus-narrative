import { useEffect, useCallback } from 'react';
import Head from 'next/head';
import { viewedPost } from '../../../api';
import MainPost from '../../../components/post/MainPost';
import Main from '../../../components/post/Main';
import Details from '../../../components/post/Details';
import prisma from '../../../libs/prisma';
import Comments from '../../../components/post/Comments';
import IsUseful from '../../../components/post/IsUseful';
import Tags from '../../../components/post/Tags';

interface IProps {
  data: {
    author: {
      blogName: string;
      id: number;
      email: string;
      lastName: string;
      firstName: string;
      profile: string | null;
      about: string | null;
    };
    id: number;
    content: string;
    title: string;
    description: string;
    createdAt: string;
    backgroundImage: string;
    tags: { name: string }[];
    category: { name: string };
  }
}

export default function Index({ data }: IProps) {

  const init = useCallback(async () => {
    if (!data.id) return;
    await viewedPost(data.id)
      .then(() => { })
      .catch(() => { })
  }, [data.id])

  useEffect(() => { init() }, [init])

  const getKeywords = (): string => {
    let text = "";
    for (let tag of data.tags) { text += (tag.name + ", ") }
    text += data.category;
    return text;
  }

  return (
    <>
      <Head>
        <title>{data.title}</title>
        <meta name="description" content={data.description}></meta>
        <meta name="keywords" content={getKeywords()}></meta>
      </Head>

      <article className='w-full block max-w-full p-4 mb-10 mt-4' >
        <MainPost image={data.backgroundImage} title={data.title} />


          <Main
            post={data.content}
            createdAt={data.createdAt}
            category={data.category.name}
            authorId={data.author.id}
            blogName={data.author.blogName}
          />

        <Details author={data.author} />
        <IsUseful postId={data.id} />
        <Tags tags={data.tags} />
        <Comments postId={data.id} />
      </article>
    </>
  )
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
      author: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          blogName: true,
          id: true,
          profile: true,
          about: true
        }
      },
      id: true,
      content: true,
      title: true,
      description: true,
      tags: { select: { name: true } },
      category: { select: { name: true } },
      createdAt: true,
      backgroundImage: true
    }
  });

  if (!postData) return { notFound: true };

  const data = JSON.parse(JSON.stringify(postData))

  return { props: { data } };
}

