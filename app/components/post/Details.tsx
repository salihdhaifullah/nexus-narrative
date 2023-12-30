import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Image from 'next/image';

interface IProps {
  author: {
    blogName: string;
    id: number;
    email: string;
    lastName: string;
    firstName: string;
    profile: string | null;
    about: string | null;
  }
};

export default function Details({ author }: IProps) {

  return (
    <Box className="flex justify-center mt-10 w-full h-full">

      <Grid item xs={12} md={4} className="bg-white border border-gray-300 w-fit rounded-md shadow-md h-fit p-4">

        <div className='inline-flex items-center'>
          <Image
            className='rounded-full'
            src={author.profile || '/images/user-placeholder.png'}
            alt="Picture of the author"
            width={80}
            height={80}
          />

          <Link href={`/profiles/${author.id}`}>
            <Typography className="text-xl link ml-2 text-center">{author.firstName + " " + author.lastName}</Typography>
          </Link>
        </div>

        {!author.about ? null : (
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200' }}>
            <Typography variant="h6" gutterBottom>
              about
            </Typography>
            <Typography>{author.about}</Typography>
          </Paper>
        )}

        <Typography className="text-lg mt-1">{author.email}</Typography>
      </Grid>
    </Box>
  );
}
