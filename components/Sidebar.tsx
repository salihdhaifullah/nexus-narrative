import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Image from 'next/image';

export interface ISidebarProps {
  description: string;
  email: string;
  name: string;
  AvatarUrl: string;
  authorId: number;
  blogName?: string;
  category?: string;
  createdAt?: string;
  isNotShow?: boolean;
}

export default function Sidebar(props: ISidebarProps) {
  const { authorId, blogName, category, createdAt, description, email, name, AvatarUrl, isNotShow } = props;

  return (
    <Box className="flex w-fit flex-col gap-6 p-4">

      {!isNotShow && (
        <>
          <Box className="flex flex-col gap-4 h-fit">

            <Typography className="text-lg">published at: {createdAt}</Typography>
            <Typography className="text-lg" component="div">
              category:
              <Link href={`/search?category=${category}`}>
                <a className="text-lg ml-1 font-bold link">{category}</a>
              </Link>
            </Typography>

            <Link href={`/${blogName}`}>
              <Typography className="link" variant="h6" gutterBottom>
                <p className="text-black inline-block no-underline cursor-default mr-2">from </p> {blogName}
              </Typography>
            </Link>
          </Box>
          
          <Divider />
        </>
      )}



      <Grid item xs={12} md={4} className="bg-white w-full rounded-md shadow-md h-fit p-4">


        <div className='inline-flex items-center'>
          <Image
            className='rounded-full'
            src={AvatarUrl || '/images/user-placeholder.png'}
            alt="Picture of the author"
            width={80}
            height={80}
          />

          <Link href={`/profiles/${authorId}`}>
            <Typography className="text-xl link ml-2 text-center">{name}</Typography>
          </Link>
        </div>

        {description === "Not Found" ? null : (
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200' }}>
            <Typography variant="h6" gutterBottom>
              about
            </Typography>
            <Typography>{description}</Typography>
          </Paper>
        )}


        <Typography className="text-lg "> connect to author |</Typography>
        <Typography className="text-lg">{email}</Typography>
      </Grid>
    </Box>
  );
}