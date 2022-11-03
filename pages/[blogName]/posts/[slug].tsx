import { getAllSlugs, getPostData } from '../../../controllers';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Markdown from '../../../components/Markdown';
import Blog from '../../../components/Blog';
import moment from 'moment';
import { getBlogDataS } from '../../../api';



export default function Post({ postData }: any) {
  console.log(postData)
  return (
    <>
      <Head>
        <title>hello-world</title>
      </Head>
      <Blog 
      authorId={postData.dataItem.author.id}
      PostsRelated={postData.PostsRelated}
      posts={postData.authorPosts.posts}
      slug={postData.slug}
      content={postData.content} 
      about={postData.dataItem.author.about}
      postId={postData.dataItem.id}
      socil={postData.dataItem.author.socil}
      email={postData.dataItem.author.email}
      title={postData.dataItem.title}
      blogName={postData.dataItem.author.blogName}
      backgroundImageUrl={postData.dataItem.backgroundImageUrl}
      AvatarUrl={postData.dataItem.author.Avter.fileUrl}
      name={postData.dataItem.author.firstName + " " + postData.dataItem.author.lastName}
      createdAt={moment(postData.dataItem.createdAt).format("ll")}
      tags={postData.dataItem.tags}
      category={postData.dataItem.category.name}
      />
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