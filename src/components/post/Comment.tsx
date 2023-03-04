import Image from 'next/image'
import { useEffect, useState } from 'react'
import { deleteComment } from '../../api';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useGetUser from '../../hooks/useGetUser';
import { IComment } from '../../types/comment';
import Toast from '../../utils/sweetAlert';
import dateFormat from '../../utils/dateFormat';
import useIsClickOut from '../../hooks/useIsClickOut';
import BackspaceIcon from '@mui/icons-material/Backspace';
import EditIcon from '@mui/icons-material/Edit';

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
  const [eleCallback] = useIsClickOut(setIsOpen)

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
          <div ref={eleCallback} className="relative z-10">
            <div className="absolute flex flex-col top-10 left-60 text-gray-600 rounded-md bg-white transition-all gap-1 shadow-md p-2">

              <div className="cursor-pointer rounded-md hover:bg-gray-200 p-3 flex flex-row gap-2 justify-center items-center">
                <span
                  onClick={() => handelDelete(comment.id)}
                  className="text-base">delete </span>
                <BackspaceIcon className="w-5 h-5" />
              </div>

              <div className="cursor-pointer rounded-md hover:bg-gray-200 p-3 flex flex-row gap-2 justify-center items-center">
                <span
                  onClick={() => handelUpdate(comment.id)}
                  className="text-base">update </span>
                <EditIcon className="w-5 h-5" />
              </div>

            </div>
          </div>
        )}


        <div className="bg-white rounded-full w-16 h-16 shadow-lg">
          <Image
            className='object-center'
            src={comment.author.profile || "/images/user-placeholder.png"}
            alt="Picture of the User"
            width={60}
            height={60}
          />
        </div>


        <span className="text-base text-gray-700 flex-1 mx-2">By {comment.author.firstName + " " + comment.author.lastName}</span>
        <span className="text-sm text-gray-500 mr-2">{dateFormat(comment.createdAt)}</span>
        {isCanUpdateAndDelete ? (<MoreVertIcon onClick={() => setIsOpen(!isOpen)} className="cursor-pointer" />) : null}

      </div>
      <hr className="mb-3" />

      <span className="text-base text-gray-700">{comment.content}</span>
    </div>
  )
}

export default Comment;
