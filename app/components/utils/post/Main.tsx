import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import formatDate from '~/utils/formatDate';
import useMarkdown from '../markdown/useMarkdown';
import { MdOutlineFullscreen, MdOutlineFullscreenExit } from 'react-icons/md/index.js';

interface IProps {
  createdAt: string;
  category: string;
  authorId: number;
  blogName: string;
  post: string;
  description: string;
};


export default function Main({ createdAt, category, authorId, blogName, post, description }: IProps) {
  const jsx = useMarkdown(`## **${description}** \n\n` + post);

  const [isFullScreen, setIsFullScreen] = useState(false)
  return (
    <div className={`bg-white transition-all ease-in-out p-4 ${isFullScreen ? "absolute z-50 top-0 left-0 right-0 bottom-0 w-full h-max" : "border border-gray-300 rounded-md shadow-lg"}`}>

      <div className="w-full flex justify-end items-center">
        <div className="text-gray-600 rounded-md cursor-pointer hover:bg-slate-200 p-2">
          {isFullScreen
          ? <MdOutlineFullscreenExit className="w-8 h-8" onClick={() => setIsFullScreen(false)}/>
          : <MdOutlineFullscreen className="w-8 h-8" onClick={() => setIsFullScreen(true)} />
          }
        </div>
      </div>

      <hr className="my-2" />

      <div className="flex w-full flex-row md:flex-nowrap flex-wrap gap-4 h-fit ">

        <p className="text-gray-800">{formatDate(createdAt)}</p>

        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-gray-800 text-lg">Category: </p>
          <Link to={`/posts?category=${category}`}>
            <p className="link mb-0"> {category} </p>
          </Link>
        </div>

        <div className="flex flex-row gap-2 items-center justify-center text-center">
          <p className="text-gray-800 text-lg">Blog: </p>
          <Link to={`/profiles/${authorId}`}>
            <p className="link mb-0"> {blogName} </p>
          </Link>
        </div>

      </div>
      <hr className="my-2" />

      {jsx}
    </div>
  );
}
