import Container from '@mui/material/Container';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import mdParser from '../../libs/markdown';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import dateFormat from '../../utils/dateFormat';
import Divider from '@mui/material/Divider';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useRef, useState } from 'react';

interface IProps {
  createdAt: string;
  category: string;
  authorId: number;
  blogName: string;
  post: string;
  description: string;
};


export default function Main({ createdAt, category, authorId, blogName, post, description }: IProps) {
  const { current: html } = useRef(mdParser(`## **${description}** \n\n` + post))

  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <div className={`bg-white transition-all ease-in-out p-4 ${isFullScreen ? "absolute z-50 top-0 left-0 right-0 bottom-0 w-full h-max" : "border border-gray-300 rounded-md shadow-lg"}`}>

      <Box className="w-full flex justify-end items-center">
        <div className="text-gray-600 rounded-md cursor-pointer hover:bg-slate-200 p-2">
          {isFullScreen
          ? <FullscreenExitIcon className="w-8 h-8" onClick={() => setIsFullScreen(false)}/>
          : <FullscreenIcon className="w-8 h-8" onClick={() => setIsFullScreen(true)} />
          }
        </div>
      </Box>

      <Divider className="my-2" />

      <Box className="flex w-full flex-row md:flex-nowrap flex-wrap gap-4 h-fit ">

        <Typography className="text-gray-800" variant="h6">{dateFormat(createdAt)}</Typography>

        <Box className="flex flex-row gap-2 items-center justify-center">
          <p className="text-gray-800 text-lg">Category: </p>
          <Link href={`/posts?category=${category}`}>
            <Typography className="link mb-0" variant="h6" gutterBottom> {category} </Typography>
          </Link>
        </Box>

        <Box className="flex flex-row gap-2 items-center justify-center text-center">
          <p className="text-gray-800 text-lg">Blog: </p>
          <Link href={`/profiles/${authorId}`}>
            <Typography className="link mb-0" variant="h6" gutterBottom> {blogName} </Typography>
          </Link>
        </Box>

      </Box>
      <Divider className="my-2" />

      <div className="custom-html-style justify-center items-center min-w-full w-full min-h-full" dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
}
