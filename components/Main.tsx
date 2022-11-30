import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import mdParser from '../libs/markdown';

export default function Main(props: {post: string;}) {
  const { post } = props;
  const html = mdParser(post)
  return (
    <Container className="bg-white p-4 rounded-md shadow-lg">
      <Divider />
      <div className="custom-html-style justify-center items-center min-w-full" dangerouslySetInnerHTML={{ __html: html }}></div>
    </Container>
  );
}