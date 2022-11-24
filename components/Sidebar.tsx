import * as React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import Image from 'next/image';

export interface ISidebarProps {
  description: string;
  email: string;
  name: string;
  AvatarUrl: string;
  authorId: number;
}

export default function Sidebar(props: ISidebarProps) {
  const { authorId, description, email, name, AvatarUrl } = props;

  return (
    <Grid item xs={12} md={4}>


      <div className='inline-flex items-center'>
        <Image
          className='rounded-full'
          src={AvatarUrl || '/images/user-placeholder.png'}
          alt="Picture of the author"
          width={80}
          height={80}
        />

        <Link href={`/Profiles/${authorId}`}>
          <Typography className="text-xl link ml-2 text-center">{name}</Typography>
        </Link>
      </div>

      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.200' }}>
        <Typography variant="h6" gutterBottom>
          about
        </Typography>
        <Typography>{description}</Typography>
      </Paper>
      <Typography className="text-lg">
        <span> connect to author |</span>

        {email}</Typography>
    </Grid>
  );
}