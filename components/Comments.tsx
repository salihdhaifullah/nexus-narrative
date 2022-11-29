import {useState, useCallback, useRef, useEffect} from 'react'
import Button from '@mui/material/Button'
import { IComment } from '../types/comment';
import { CreateComment, GetComments, updateComment } from '../api';
import Comment from './Comment';


const Comments = ({ postId }: { postId: number }) => {
    const formRef = useRef<HTMLDivElement | null>(null);

    const [commentState, setComment] = useState("");
    const [comments, setComments] = useState<IComment[]>([]);
    const [changeComments, setChangeComments] = useState(false);
    const [idToUpdate, setIdToUpdate] = useState<number | null>(null)


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

        if (!idToUpdate) {
            await CreateComment({ postId: Number(postId), comment: commentState })
                .then((res) => { })
                .catch((err) => { })
        } else {
            await updateComment(idToUpdate, commentState)
                .then((res) => { })
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
        <>
            <div className="rounded-lg h-fit shadow-lg bg-white p-6" ref={formRef}>
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
                    <Button onClick={handelCreateOrUpdateComment} className="px-3 py-2 hover:text-blue-600 hover:border-blue-600 hover:border hover:bg-white text-sm text-white bg-blue-600 rounded">
                        Comment
                    </Button>
                    <Button
                        onClick={() => setComment("")}
                        className="px-3 py-2 text-sm hover:text-white border-blue-600 hover:bg-blue-600 text-blue-600 border rounded">
                        Cancel
                    </Button>
                </div>
            </div>

            <div className="flex flex-col">
                {comments?.length ? comments.map((comment, index) => (
                    <Comment comment={comment}
                        setChangeComments={setChangeComments}
                        changeComments={changeComments}
                        setIdToUpdate={setIdToUpdate}
                        scrollToForm={scrollToForm} key={index} />
                )) : null}
            </div>
        </>
    )
}

export default Comments