import { getAllSlugs, getPostData } from '../../../controllers';
import Head from 'next/head';
import Blog from '../../../components/Blog';
import CircularProgress from '@mui/material/CircularProgress'
import { IPostProps } from '../../../types/post';



export default function Post(props: IPostProps) {
  console.log(props);
  return (
    <>
      <Head>
        <title>hello-world</title>
      </Head>
      {props.data ? (
        <Blog data={props.data} />
      ) : (
        <CircularProgress />
      )}
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

interface IGetStaticProps {
  params: {
    slug: string;
  }
}

export async function getStaticProps(prop: IGetStaticProps) {
  const data: IPostProps = await getPostData(prop.params.slug);
  return {
    props: {
      data
    },
  };
}