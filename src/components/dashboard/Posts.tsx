import { DeletePost, getPostsTable } from '../../api';
import Toast from '../../utils/sweetAlert';
import { useEffect, useState, ChangeEvent, useCallback, useRef } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Link from 'next/link';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import dateFormat from '../../utils/dateFormat';
import { IPost } from '../../types/post';

export default function Posts({ postsInit }: { postsInit: IPost }) {
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState(postsInit.posts)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const isFirstRender = useRef(true)

    const handelDelete = async (postId: number) => {
        Swal.fire({
            title: 'Are you sure you want to delete this post',
            icon: "warning",
            showCancelButton: true,
            showConfirmButton: true
        }).then(async (res) => {
            if (!res.value) return;
            await DeletePost(postId)
                .then((res) => {
                    setPosts(posts.filter(p => p.id !== postId))
                    Toast.fire(res.data.massage || "Post successfully deleted", '', 'success')
                })
                .catch((err) => { Toast.fire(err.response.data.massage || "some thing want wrong", '', 'error') })
        })
    }

    const handelGetPosts = useCallback(async () => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return;
        }

        setIsLoading(true)
        await getPostsTable(postsInit.blogName, page, rowsPerPage)
            .then((res) => { setPosts(res.data.posts.posts) })
            .catch((err) => { console.log(err) })
            .finally(() => { setIsLoading(false) })
    }, [page])

    useEffect(() => {
        handelGetPosts()
    }, [handelGetPosts])

    return (
        <Box className='flex flex-col justify-center items-center mx-4 mb-10'>
            <div className="flex w-full flex-col items-start gap-4 mt-10 justify-start">
                <h1 className='text-3xl text-gray-800 font-bold mb-4'>Posts</h1>

                <Paper className="w-full overflow-auto">
                    <Link href='/create-post'>
                        <Box className="w-fit h-fit border m-1 z-[101] rounded-md">
                            <Button className="hover:shadow-lg z-[100] transition-all hover:shadow-blue-500">
                                Create a Post
                            </Button>
                        </Box>
                    </Link>

                    {isLoading ?
                        <div className='w-full h-[40vh] flex justify-center items-center'>
                            <CircularProgress className='w-12 h-12' />
                        </div>
                        : (
                            <TableContainer>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell className="text-base min-w-[120px]">slug</TableCell>
                                            <TableCell className="text-base min-w-[120px]">views</TableCell>
                                            <TableCell className="text-base min-w-[120px]">title</TableCell>
                                            <TableCell className="text-base min-w-[120px]">createAt</TableCell>
                                            <TableCell className="text-base min-w-[120px]">likes</TableCell>
                                            <TableCell className="text-base min-w-[120px]">dislikes</TableCell>
                                            <TableCell className="text-base min-w-[120px]">update</TableCell>
                                            <TableCell className="text-base min-w-[120px]">delete</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {!posts?.length ? null : posts.map((post) => (
                                            <TableRow key={post.slug} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <Link href={`/${postsInit.blogName}/posts/${post.slug}`}>
                                                    <TableCell className="link text-blue-700" component="th" scope="row">
                                                        {post.slug}
                                                    </TableCell>
                                                </Link>
                                                <TableCell>{post._count.views}</TableCell>
                                                <TableCell>{post.title}</TableCell>
                                                {/* @ts-ignore */}
                                                <TableCell>{dateFormat(Date(post.createAt))}</TableCell>

                                                <TableCell>{post.likesCount}</TableCell>
                                                <TableCell>{post.dislikesCount}</TableCell>

                                                <Link href={`/update-post/?id=${post.id}`}>
                                                    <TableCell>
                                                        <Button className="bg-green-500 text-white shadow-md lowercase p-0 shadow-green-500">Update</Button>
                                                    </TableCell>
                                                </Link>
                                                <TableCell>
                                                    <Button onClick={() => handelDelete(post.id)} className="text-white bg-red-500 shadow-md lowercase p-0 shadow-red-500">Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    <Divider />
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={postsInit._count.posts}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event: unknown, newPage: number) => { setPage(newPage) }}
                        onRowsPerPageChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setRowsPerPage(+event.target.value)
                            setPage(0)
                        }}
                    />
                </Paper>
            </div>
        </Box>
    );
};
