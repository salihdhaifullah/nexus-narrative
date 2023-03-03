import { useCallback, useEffect, useState } from 'react';
import { dislikePost, GetLikes, likePost } from '../../api';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import useGetUser from '../../hooks/useGetUser';

const IsUseful = ({ postId }: { postId: number }) => {
    const [isLikeLoading, setIsLikeLoading] = useState<boolean>(false);
    const [isDisLikeLoading, setIsDisLikeLoading] = useState<boolean>(false);
    const [likes, setLikes] = useState(0)
    const [dislikes, setDislikes] = useState(0);
    const [user] = useGetUser();
    const router = useRouter();

    const handelGetLikes = useCallback(async () => {
        if (!postId) return;
        await GetLikes(postId)
            .then((res) => {
                setLikes(res.data.likes)
                setDislikes(res.data.dislikes)
            })
            .catch((err) => { });
    }, [postId])

    useEffect(() => { handelGetLikes() }, [handelGetLikes])

    const handelLike = async () => {
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
        setIsLikeLoading(true)
        await likePost(postId)
            .then((res) => { handelGetLikes() })
            .catch((err) => { })
            .finally(() => { setIsLikeLoading(false)  })
    }

    const handelDisLike = async () => {
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

        setIsDisLikeLoading(true)
        await dislikePost(postId)
            .then((res) => { handelGetLikes() })
            .catch((err) => { })
            .finally(() => { setIsDisLikeLoading(false) })
    }


    return (
        <Box className="flex flex-col w-full justify-center items-center">
            <Grid className="flex-col mt-20 border p-4 w-fit rounded-md border-gray-300 bg-white shadow-md">
                <Typography variant='h6' component="h2">Did you find this content usefully ?</Typography>

                <div className="mt-4 flex flex-row gap-2">
                    {isLikeLoading
                        ? <Button disabled className="border border-gray-800 rounded-md bg-blue-400 hover:bg-blue-500"><CircularProgress className="w-6 h-6 text-white" /></Button>
                        : <Button className="border border-gray-800 rounded-md bg-blue-400 hover:bg-blue-500 text-white" onClick={handelLike} startIcon={<ThumbUpIcon className="w-6 h-6 text-white" />}>{likes}</Button>}
                    {isDisLikeLoading
                        ? <Button disabled className="border border-gray-800 rounded-md bg-blue-400 hover:bg-blue-500"> <CircularProgress className="w-6 h-6 text-white" /> </Button>
                        : <Button className="border border-gray-800 rounded-md bg-blue-400 hover:bg-blue-500 text-white" onClick={handelDisLike} startIcon={<ThumbDownAltIcon className="w-6 h-6 text-white" />}>{dislikes}</Button>}
                </div>

            </Grid>
        </Box>
    )
}

export default IsUseful
