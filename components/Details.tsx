import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Image from 'next/image';

export interface IDetailsProps {
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

export default function Details(props: IDetailsProps) {
  const { authorId, blogName, category, createdAt, description, email, name, AvatarUrl, isNotShow } = props;

  return (
    <Box className="flex flex-col sm:flex-row lg:flex-col lg:h-fit justify-evenly w-full lg:w-fit gap-6 p-4">

      {!isNotShow && (
        <>
          <Box className="flex flex-col gap-4 md:w-full md:justify-center items-start h-fit md:h-full">

            <Typography className="text-gray-800" variant="h6">published at: {createdAt}</Typography>

            <Box className="flex flex-row items-center justify-center">
            <Typography variant="h6" className="text-gray-800 mr-2">category:  </Typography>
              <Link href={`/search?category=${category}`}>
                <Typography className="link" variant="h6" gutterBottom> {category} </Typography>
              </Link>
            </Box>

            <Box className="flex flex-row items-center justify-center">
              <Typography variant="h6" className="text-gray-800 mr-2">from:  </Typography>
              <Link href={`/profiles/${authorId}`}>
                <Typography className="link" variant="h6" gutterBottom> {blogName} </Typography>
              </Link>
            </Box>

          </Box>

          <Divider />
        </>
      )}



      <Grid item xs={12} md={4} className="bg-white border border-gray-300 w-full rounded-md shadow-md h-fit p-4">

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

        <Typography className="text-lg mt-1">author email: {email}</Typography>
      </Grid>
    </Box>
  );
}
