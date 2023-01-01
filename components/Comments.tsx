import { useState, useCallback, useRef, useEffect } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { IComment } from '../types/comment';
import { CreateComment, GetComments, updateComment } from '../api';
import Comment from './Comment';
import useGetUser from '../hooks/useGetUser';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';


const Comments = ({ postId }: { postId: number }) => {
    const formRef = useRef<HTMLDivElement | null>(null);
    const [user] = useGetUser();
    const [commentState, setComment] = useState("");
    const [comments, setComments] = useState<IComment[]>([]);
    const [changeComments, setChangeComments] = useState(false);
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

        if (!idToUpdate) {
            await CreateComment({ postId: Number(postId), comment: commentState })
                .catch((err) => { })
        } else {
            await updateComment(idToUpdate, commentState)
                .catch((err) => { })
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
        <Box className="md:mx-10">
            <hr className='mt-20 mb-20' />

            <div className='flex mb-6 justify-start items-start'>
                <Typography variant='h5' className="underLine" component="h2">Comments Section</Typography>
            </div>

            <section className={`${!comments?.length ? "max-w-[500px]" : "lg:grid-cols-2 gap-10"} grid grid-cols-1`}>
                <div className="rounded-lg max-w-[500px] h-fit shadow-lg bg-white p-3 " ref={formRef}>
                    <div className="mb-2">
                        <label htmlFor="comment" className="text-lg text-gray-600">Add a comment</label>
                        <textarea
                            value={commentState}
                            onChange={(event) => setComment(event.target.value)}
                            id="comment"
                            className="min-h-[10rem] min-w-full p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1"
                            name="comment"
                            placeholder=""></textarea>
                    </div>
                    <div className="justify-evenly flex items-center">
                        <Button onClick={handelCreateOrUpdateComment} className="px-3 py-2 hover:text-blue-600 hover:border-blue-600 hover:border hover:bg-white text-sm text-white bg-blue-600 rounded"> Comment </Button>
                        <Button onClick={() => setComment("")}
                            className="px-3 py-2 text-sm hover:text-white border-blue-600 hover:bg-blue-600 text-blue-600 border rounded">
                            Cancel
                        </Button>
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
