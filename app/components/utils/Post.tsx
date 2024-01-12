import { Link } from '@remix-run/react';
import { MdModeComment, MdOutlineThumbDownOffAlt, MdOutlineThumbUpOffAlt } from 'react-icons/md/index.js';
import formatDate from '~/utils/formatDate';

export interface IPostProps {
  backgroundImage: string;
  title: string;
  slug: string;
  description: string;
  createdAt: Date;
  author: {
    blogName: string;
  };
  _count: { comments: number };
  likesCount: number;
  dislikesCount: number;
}


export default function Post({ post }: { post: IPostProps }) {
  return (
    <div className="w-full flex h-[200px]">
      <div className="w-full h-[200px]">

        <Link to={`/${post.author.blogName}/posts/${post.slug}`}>
          <div className="relative h-[200px]">
            <div className="flex w-full h-full items-start">

              <div className="flex-1 h-[200px] flex flex-col justify-between">
                <div className="flex flex-col">

                  <h2 className="text-xl"> {post.title} </h2>

                  <p className='text-base text-gray-600'> {formatDate(post.createdAt)} </p>

                  <p className='text-base text-gray-600'>
                    {post.description.length > 150 ? `${post.description.substring(0, 150)}...` : post.description}
                  </p>


                  <p className='text-base text-blue-600'>
                    Continue reading...
                  </p>
                </div>

                <div className="flex flex-row gap-4 justify-center">
                  <div className="hover:bg-gray-200 cursor-default text-blue-500 rounded-full p-2">
                    <MdOutlineThumbUpOffAlt /> {post.likesCount}
                  </div>

                  <div className="hover:bg-gray-200 cursor-default text-blue-500 rounded-full p-2">
                    <MdOutlineThumbDownOffAlt /> {post.dislikesCount}
                  </div>

                  <div className="hover:bg-gray-200 cursor-default text-blue-500 rounded-full p-2">
                    <MdModeComment /> {post._count.comments}
                  </div>

                </div>
              </div>

              <img
                className="object-contain h-28"
                src={post.backgroundImage}
                alt={post.title}
              />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
