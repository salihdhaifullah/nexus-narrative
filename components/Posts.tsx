import { DeletePost, GetPagesNumber, GetPostsPageData } from '../api';
import Toast from '../functions/sweetAlert';
import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import moment from 'moment';
import Link from 'next/link';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

interface IPost {
    slug: string
    _count: {
        views: number
    }
    title: string
    id: number
    createAt: Date;
    likes: {
        isLike: boolean
        isDislike: boolean
    }[]
}

export default function Posts() {
    const [isLoading, setIsLoading] = useState(true);
    const [blogName, setBlogName] = useState("");
    const [posts, setPosts] = useState<IPost[]>([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);

    const init = useCallback(async () => {
        await GetPagesNumber()
            .then((res) => { setCount(res.data.length) })
            .catch((err) => { console.error(err) });
    }, [])

    const getPostsPagination = useCallback(async () => {
        setIsLoading(true)
        await GetPostsPageData((page * rowsPerPage), rowsPerPage)
            .then((res) => {
                setPosts(res.data.data.posts)
                if (!blogName) setBlogName(res.data.data.blogName)
            })
        setIsLoading(false)

    }, [page, rowsPerPage])

    useEffect(() => {
        getPostsPagination()
    }, [getPostsPagination])

    useEffect(() => {
        init()
    }, [init])


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

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Box className='flex flex-col justify-center items-center mx-4 mb-10'>

            <div className="flex w-full flex-col items-start gap-4 mt-10 justify-start">

                <h1 className='text-3xl text-gray-800 font-bold mb-4'>Posts</h1>

                {!isLoading ?
                    count < 1 ? (
                        <>
                            <Link href='/admin/create-post'>
                                <Box className="w-fit h-fit border m-1 z-[101] rounded-md">
                                    <Button className="hover:shadow-lg z-[100] transition-all hover:shadow-blue-500">
                                        Create a Post
                                    </Button>
                                </Box>
                            </Link>
                            <Typography variant='h4'>No Posts Found</Typography>
                        </>
                    ) : (
                            <Paper className="w-full overflow-auto">
                                <Link href='/admin/create-post'>
                                    <Box className="w-fit h-fit border m-1 z-[101] rounded-md">
                                        <Button className="hover:shadow-lg z-[100] transition-all hover:shadow-blue-500">
                                            Create a Post
                                        </Button>
                                    </Box>
                                </Link>
                                <TableContainer>
                                    <Table stickyHeader aria-label="sticky table">

                                        <TableHead>
                                            <TableRow>
                                                <TableCell className="text-base">slug</TableCell>
                                                <TableCell className="text-base" align="right">views</TableCell>
                                                <TableCell className="text-base" align="right">title</TableCell>
                                                <TableCell className="text-base" align="right">createAt</TableCell>
                                                <TableCell className="text-base" align="right">likes</TableCell>
                                                <TableCell className="text-base" align="right">dislikes</TableCell>
                                                <TableCell className="text-base" align="right">edit</TableCell>
                                                <TableCell className="text-base" align="right">delete</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {posts.map((post) => (
                                                <TableRow key={post.slug} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <Link href={`/${blogName}/posts/${post.slug}`}>
                                                        <TableCell className="link text-blue-700" component="th" scope="row">
                                                            {post.slug}
                                                        </TableCell>
                                                    </Link>
                                                    <TableCell align="right">{post._count.views}</TableCell>
                                                    <TableCell align="right">{post.title}</TableCell>
                                                    <TableCell align="right">{moment(post.createAt).format("ll")}</TableCell>

                                                    <TableCell align="right">{post.likes.filter((item) => item.isLike === true).length}</TableCell>
                                                    <TableCell align="right">{post.likes.filter((item) => item.isDislike === true).length}</TableCell>

                                                    <Link href={`/admin/update-post/?id=${post.id}`}>
                                                        <TableCell align="right">
                                                            <Button className="bg-green-500 text-white shadow-md lowercase p-0 shadow-green-500">Edit</Button>
                                                        </TableCell>
                                                    </Link>
                                                    <TableCell align="right">
                                                        <Button onClick={() => handelDelete(post.id)} className="text-white bg-red-500 shadow-md lowercase p-0 shadow-red-500">Delete</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Divider />
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={count}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        ) : (
                        <Box className="flex items-center justify-center">
                            <CircularProgress />
                        </Box>
                    )}
            </div>
        </Box>
    );
};
