import Layout from '../../../components/layout';
import { getAllSlugs, getPostData } from '../../../controllers';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Markdown from '../../../components/Markdown';
import Blog from '../../../components/Blog';

export default function Post({ postData }: any) {
  console.log(postData);
  return (
    <>
      <Head>
        <title>hello-world</title>
      </Head>
      <Blog 
      content={postData.content} 
      about={postData.dataItem.author.about}
      socil={postData.dataItem.author.socil}
      email={postData.dataItem.author.email}
      title={postData.dataItem.title}
      blogName={postData.dataItem.author.blogName}
      backgroundImageUrl={postData.dataItem.backgroundImageUrl}/>
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.slug);
  return {
    props: {
      postData,
    },
  };
}