import Image from 'next/image'
import { useEffect, useState } from 'react'
import { deleteComment } from '../api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useGetUser from '../hooks/useGetUser';
import { IComment } from '../types/comment';
import Toast from '../utils/sweetAlert';
import dateFormat from '../utils/dateFormat';

interface ICommentProps {
  comment: IComment;
  scrollToForm: () => void;
  setIdToUpdate: (id: number) => void;
  setChangeComments: (value: boolean) => void;
  changeComments: boolean;
}


const Comment = ({ setChangeComments, changeComments, comment, scrollToForm, setIdToUpdate }: ICommentProps) => {

  const [user] = useGetUser()
  const [isOpen, setIsOpen] = useState(false);
  const [isCanUpdateAndDelete, setIsCanUpdateAndDelete] = useState(false)

  useEffect(() => {
    if (user?.id && Number(user?.id) === Number(comment.authorId)) setIsCanUpdateAndDelete(true);
  }, [comment.authorId, user?.id])

  const handelDelete = async (id: number) => {
    setIsOpen(false)
    await deleteComment(id)
    .then((res) => { Toast.fire(res.data.massage || "Success Deleting Comment", "", "success") })
    .catch((err) => { Toast.fire(err.response.data.massage || "Some Thing Went Wrong !", "", "error") })
    setChangeComments(!changeComments)
  }

  const handelUpdate = (id: number) => {
    setIsOpen(false)
    scrollToForm()
    setIdToUpdate(id)
  }

  return (
    <div className="h-fit p-4 mt-4 max-w-[500px] rounded-md bg-white shadow-md">
      <div className="mb-2 flex">

        {isOpen && (
          <span className="relative z-10">
            <div className="absolute flex flex-col top-10 rounded-md bg-white transition-all shadow-md p-2">
              <span
                onClick={() => handelDelete(comment.id)}
                className="cursor-pointer hover:bg-gray-200 px-3 py-[6px] text-base  mb-2">Delete</span>
              <span
                onClick={() => handelUpdate(comment.id)}
                className="cursor-pointer hover:bg-gray-200 px-3 py-[6px] text-base">Update</span>
            </div>
          </span>
        )}

        {isCanUpdateAndDelete ? (<MoreVertIcon  onClick={() => setIsOpen(!isOpen)} className="cursor-pointer" />) : null}

        <Image
          className='rounded-full object-fill'
          src={comment.author.profile || "/images/user-placeholder.png"}
          alt="Picture of the User"
          width={60}
          height={60}
        />

        <span className="text-base text-gray-700 mr-2 flex-1 ml-6">By {comment.author.firstName + " " + comment.author.lastName}</span>
        <span className="text-sm text-gray-500">{dateFormat(comment.createdAt)}</span>
      </div>
      <hr className="mb-3" />

      <span className="text-base text-gray-700">{comment.content}</span>
    </div>
  )
}

export default Comment;
