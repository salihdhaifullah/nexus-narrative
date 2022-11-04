import { getPostData } from '../../../controllers';
import Head from 'next/head';
import Blog from '../../../components/Blog';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress'
import { useRouter } from 'next/router';
import { GetAllSlugs } from '../../../api';


export default function Post({ postData }: any) {
  console.log(postData)
  const router = useRouter()
  return router.isFallback ? (
    <CircularProgress />
  ) : (
    <>
      <Head>
        <title>hello-world</title>
      </Head>
      {postData ? (
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
      ) : (
        <CircularProgress />
      )}
    </>
  );
}

export async function getStaticPaths() {
  const paths = await (await GetAllSlugs()).data.slugs;
  console.log(paths)
  return {
    paths,
    fallback: false,
  };
}

interface IGetStaticProps {
  params: {
    slug: string;
  }
}

export async function getStaticProps(prop: IGetStaticProps) {
  const postData = await getPostData(prop.params.slug);
  return {
    props: {
      postData,
    },
  };
}