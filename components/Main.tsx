import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Markdown from './Markdown';
import Link from 'next/link';

interface MainProps {
  post: string;
  blogName: string;
}

export default function Main(props: MainProps) {
  const { post, blogName } = props;

  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Link href={`/${blogName}`}>
      <Typography className="link" variant="h6" gutterBottom>
         {"from " + blogName }
      </Typography>
      </Link>
      <Divider />
        <Markdown className="markdown" key={post.substring(0, 40)}>
          {post}
        </Markdown>
    </Grid>
  );
}