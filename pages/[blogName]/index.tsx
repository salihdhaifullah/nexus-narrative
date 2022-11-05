import { useEffect } from 'react'
import { getAllBlogsName, getBlogDataForHomePage } from '../../controllers'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import createTheme from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import FeaturedPost from '../../components/FeaturedPost';
import Sidebar from '../../components/Sidebar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { IFeaturedPostProps } from '../../types/post';


const theme = createTheme();


interface IProps {
  data: {
    about: string | null;
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  
    Avter: {
      fileUrl: string;
    } | null;
  
    socil: {
      name: string;
      link: string;
    }[];
  
    posts: IFeaturedPostProps[] 
  }
}


export default function Index({ data }: IProps) {

  return (
    <>
      {data ? (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="lg" >
            <main>
              <div className="grid grid-cols-5 grid-flow-dense gap-10 my-16">

                <div className="col-span-3">
                  <div className='flex justify-center items-center mt-14 mb-8'>
                    <Typography className="mb-4 underLine" variant='h5' component='h1'> Posts From The author </Typography>
                  </div>
                  {data?.posts.length > 0 ? data?.posts.map((post, index) => (
                    <div key={index} className="mb-4">
                      <FeaturedPost post={post} />
                    </div>
                  )) : (
                    <Typography className="mb-4 underLine" variant='h5' component='h1'> Sorry No Posts Found </Typography>
                  )}
                </div>

                <div className="col-span-2">
                  <Sidebar
                    description={data?.about || "Not Found"}
                    social={data.socil}
                    email={data.email}
                    name={data.firstName + " " + data.lastName}
                    AvatarUrl={data?.Avter?.fileUrl || "/images/user-placeholder.png"}
                    authorId={data.id}
                  />
                </div>

              </div>
            </main>
          </Container >
        </ThemeProvider >
      ) : (
        <CircularProgress />
      )}
    </>
  );
}

export async function getStaticPaths() {
  const paths = await getAllBlogsName();
  return {
    paths,
    fallback: false,
  };
}

interface IGetStaticProps {
  params: {
    blogName: string;
  }
}

export async function getStaticProps(props: IGetStaticProps) {
  const data = await getBlogDataForHomePage(props.params.blogName);
  return {
    props: data,
  };
}