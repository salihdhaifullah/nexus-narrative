import { useState, useCallback, useRef, useEffect } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { IComment } from '../../types/comment';
import { CreateComment, GetComments, updateComment } from '../../api';
import Comment from './Comment';
import useGetUser from '../../hooks/useGetUser';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import { CircularProgress } from '@mui/material';


const Comments = ({ postId }: { postId: number }) => {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [user] = useGetUser();
    const [commentState, setComment] = useState("");
    const [comments, setComments] = useState<IComment[]>([]);
    const [changeComments, setChangeComments] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [idToUpdate, setIdToUpdate] = useState<number | null>(null)
    const router = useRouter();


    const handelGetComments = useCallback(async () => {
        if (!postId) return;
        await GetComments(postId)
            .then((res) => { setComments(res.data.comments.comments) })
    }, [postId])


    useEffect(() => {
        handelGetComments()
    }, [changeComments, handelGetComments])

    useEffect(() => {
        if (idToUpdate) {
            const content: string | undefined = comments.find((c: IComment) => c.id === idToUpdate)?.content;
            if (content) setComment(content)
        }
    }, [comments, idToUpdate])

    const handelCreateOrUpdateComment = async () => {
        if (!commentState) return;
        if (!user) {
            return Swal.fire({
                title: "You Need to Login",
                text: "You Need to Login To Make This Action",
                icon: "info",
                showCancelButton: true,
                showConfirmButton: true
            })
                .then((res) => { if (res.value) router.push("/login") })
        };

        setIsLoading(true)
        if (!idToUpdate) {
            await CreateComment({ postId: Number(postId), comment: commentState })
                .catch((err) => { })
                .finally(() => { setIsLoading(false) })
        } else {
            await updateComment(idToUpdate, commentState)
                .catch((err) => { })
                .finally(() => { setIsLoading(false) })
            setIdToUpdate(null)
        }
        setChangeComments(!changeComments)
        setComment("")
    }

    const scrollToForm = () => {
        if (formRef?.current && formRef.current?.offsetLeft && formRef.current?.offsetTop) {
            scroll(formRef.current.offsetLeft, (formRef.current.offsetTop - 200));
        }
    }

    return (
        <Box>
            <hr className='mt-20 mb-20' />

            <div className='flex mb-6 justify-start items-start'>
                <Typography variant='h5' className="underLine" component="h2">Comments Section</Typography>
            </div>

            <section className="flex flex-col w-full gap-10 justify-center items-center">

                <div className="w-full flex items-center justify-start">
                    <div className="rounded-lg w-fit h-fit shadow-lg bg-white py-3 px-6" ref={formRef}>
                        <div className="mb-2">
                            <label htmlFor="comment" className="text-lg text-gray-600">add a comment</label>
                            <textarea
                                value={commentState}
                                onChange={(event) => setComment(event.target.value)}
                                id="comment"
                                className="min-h-[10rem] min-w-full p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1"
                                name="comment"
                                placeholder=""></textarea>
                        </div>
                        <div className="justify-evenly flex items-center">
                            <Button onClick={() => isLoading ? undefined : handelCreateOrUpdateComment()} className="px-3 py-2 hover:text-blue-600 hover:border-blue-600 hover:border hover:bg-blue-100 text-sm text-white bg-blue-600 rounded">
                                {isLoading ? <CircularProgress className="w-6 h-6 text-inherit" /> : "Comment"}
                            </Button>
                            <Button onClick={() => setComment("")}
                                className="px-3 py-2 text-sm bg-blue-100 hover:text-white border-blue-600 hover:bg-blue-600 text-blue-600 border rounded">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>

                {!comments?.length ? null : (
                    <div className="flex flex-col">
                        {comments.map((comment, index) => (
                            <Comment
                                comment={comment}
                                setChangeComments={setChangeComments}
                                changeComments={changeComments}
                                setIdToUpdate={setIdToUpdate}
                                scrollToForm={scrollToForm} key={index} />
                        ))}
                    </div>
                )}

            </section>
        </Box>
    )
}

export default Comments
