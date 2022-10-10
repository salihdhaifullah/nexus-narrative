import Layout from '../../components/layout';
import { getAllSlugs, getPostData } from '../../controllers';

export default function Post({ postData }: any) {
  console.log(postData);
  return (
        <Layout>
          <div dangerouslySetInnerHTML={{__html: postData.contentHtml}}></div>
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