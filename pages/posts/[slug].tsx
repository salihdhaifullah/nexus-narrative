import Layout from '../../components/layout';
import { getAllSlugs, getPostData } from '../../controllers';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Post({ postData }: any) {
  console.log(postData);
  return (
    <Layout>
      <Head>
        <title>hello-world</title>
      </Head>
      <ReactMarkdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
        {postData.content}
      </ReactMarkdown>
    </Layout>
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