import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { deleteComment } from '../api';
import plaseHolder from '../public/images/user-placeholder.png';
import { IUser } from '../types/user';
import moment from 'moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ICommentProps {
  comment: {
    author: {
      Avter: {
        fileUrl: string;
      }
      firstName: string;
      lastName: string;
    }
    authorId: number;
    content: string;
    createdAt: Date;
    id: number;
  }
  scrollToForm: () => void;
  setIdToUpdate: (id: number) => void;
  setChangeComments: (value: boolean) => void;
  changeComments: boolean;
}


const Comment = ({ setChangeComments, changeComments, comment, scrollToForm, setIdToUpdate }: ICommentProps) => {

  const isServer = typeof window === 'undefined';
  const [isFound, setIsFound] = useState<any>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [changeUi, setChangeUi] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isServer) setIsFound(localStorage.getItem("user"));
    if (isFound) setUser(JSON.parse(isFound));
    setChangeUi(!changeUi)
  }, [isFound])

  useEffect(() => {
    setChangeUi(!changeUi)
  }, [user])


  const handelDelete = async (id: number) => {
    await deleteComment(id).then((res) => {
    }).catch((err: any) => {
    })
    setChangeComments(!changeComments)
  }

  const handelUpdate = (id: number) => {
    scrollToForm()
    setIdToUpdate(id)
  }

  return (
    <div className="h-fit p-4 mt-4 rounded-md bg-white shadow-md">
      <div className="mb-2 flex">

        {isOpen && (
          <span className="relative z-10">
            <div className="absolute flex flex-col top-10 rounded-md bg-white transition-all shadow-md p-4">
              <span
                onClick={() => handelDelete(comment.id)}
                className="cursor-pointer hover:bg-gray-200 px-3 py-[6px] text-base  mb-2">Delete</span>
              <span
                onClick={() => handelUpdate(comment.id)}
                className="cursor-pointer hover:bg-gray-200 px-3 py-[6px] text-base">Update</span>
            </div>
          </span>
        )}

        {user?.id && Number(user?.id) === Number(comment.authorId) && (
          <MoreVertIcon onClick={() => setIsOpen(!isOpen)} className="cursor-pointer" />
        )}

        <Image
          className='rounded-full object-fill'
          src={comment.author.Avter?.fileUrl || plaseHolder}
          alt="Picture of the author"
          width={60}
          height={60}
        />
        <span className="text-base text-gray-700 mr-2 flex-1 ml-6">By {comment.author.firstName + " " + comment.author.lastName}</span>
        <span className="text-sm text-gray-500">{moment(comment.createdAt).format('ll')}</span>
      </div>
      <hr className="mb-3" />

      <span className="text-base text-gray-700">{comment.content}</span>
    </div>
  )
}

export default Comment;