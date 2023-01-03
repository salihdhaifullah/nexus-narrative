import Container from '@mui/material/Container';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import mdParser from '../libs/markdown';

export default function Main(props: {post: string;}) {
  const { post } = props;
  const html = mdParser(post) // i use markdown-it i think we save know right 🤔?

  return (
    <Container className="bg-white p-4 border border-gray-300 rounded-md shadow-lg">
      <div className="custom-html-style justify-center items-center min-w-full" dangerouslySetInnerHTML={{__html: html}}></div>
    </Container>
  );
}
