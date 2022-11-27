import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import mdParser from '../libs/markdown';


interface MainProps {
  post: string;
  blogName: string;
}

export default function Main(props: MainProps) {
  const { post, blogName } = props;
  const html = mdParser(post)
  return (
    <Grid item xs={12} md={8} sx={{'& .custom-html-style': { py: 3 } }} >
      <Link href={`/${blogName}`}>
      <Typography className="link" variant="h6" gutterBottom>
      <h6 className="text-black inline-block no-underline cursor-default mr-2">from </h6> {blogName}
      </Typography>
      </Link>
      <Divider />

        <div className="custom-html-style" dangerouslySetInnerHTML={{__html: html}}></div>

    </Grid>
  );
}