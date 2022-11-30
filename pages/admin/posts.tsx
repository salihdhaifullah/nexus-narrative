import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { DeletePost, GetPagesNumber, GetPostsPageData } from '../../api';
import Link from 'next/link';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import Toast from '../../functions/sweetAlert';


interface IPost {
    slug: string
    _count: {
        views: number
    }
    title: string
    id: number
}

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [blogName, setBlogName] = useState("");
    const [posts, setPosts] = useState<IPost[]>([])
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(5);
    const [postPages, setPostsPages] = useState<number[]>([]);
    const [activePage, setActivePage] = useState(0)

    const init = useCallback(async () => {
        await GetPagesNumber()
            .then((res) => {
                const pages = [];
                for (let i = 0; i < Math.ceil(res.data.length / take); i++) { pages.push(i) };
                setPostsPages(pages)
            })
            .catch((err) => { console.error(err) });
    }, [take])

    const getPostsPagination = useCallback(async () => {
        setIsLoading(true)
        await GetPostsPageData(skip, take)
            .then((res) => {
                setPosts(res.data.data.posts)
                setBlogName(res.data.data.blogName)
                if (res.data.data.posts) setIsLoading(false);
            })
            setIsLoading(false)

    }, [skip, take])

    useEffect(() => {
        getPostsPagination()
    }, [getPostsPagination])

    useEffect(() => {
        init()
    }, [init])

    const handelNextPage = () => {
        const page = (activePage + 1);
        if (activePage < (postPages.length - 1)) setActivePage(page);
        setSkip(page * take);
    }

    const handelPreviousPage = () => {
        const page = (activePage - 1);
        if (activePage > 0) setActivePage(page);
        setSkip(page * take);
    }

    const handelToPage = (pageIndex: number) => {
        setActivePage(pageIndex++);
        setSkip(pageIndex++ * take);
    }


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

    return (
        <Box className='flex justify-center items-center mb-10'>
            <div className="flex w-full flex-col px-8 py-6 items-center gap-4 mt-10 justify-center">

                <Box className="w-full items-start flex justify-between mb-10">
                    <Link href='/admin/create-post'>
                        <Button className="shadow-md hover:shadow-xl transition-all hover:shadow-blue-500 shadow-blue-500">
                            Create a Post
                        </Button>
                    </Link>
                </Box>


                {!isLoading ? postPages.length > 0 && posts.length > 0 ? (
                    <>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="text-base">slug</TableCell>
                                        <TableCell className="text-base" align="right">views</TableCell>
                                        <TableCell className="text-base" align="right">title</TableCell>
                                        <TableCell className="text-base" align="right">update</TableCell>
                                        <TableCell className="text-base" align="right">delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {posts.map((post) => (
                                        <TableRow key={post.slug} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <Link href={`/${blogName}/posts/${post.slug}`}>
                                                <TableCell className="link" component="th" scope="row">
                                                    {post.slug}
                                                </TableCell>
                                            </Link>
                                            <TableCell align="right">{post._count.views}</TableCell>
                                            <TableCell align="right">{post.title}</TableCell>
                                            <Link href={`/admin/update-post/?id=${post.id}`}>
                                                <TableCell align="right" className="link">update</TableCell>
                                            </Link>
                                            <TableCell align="right" onClick={() => handelDelete(post.id)} className="link">delete</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <nav aria-label="Page navigation" className="mt-[200px]">
                            <ul className="flex items-center">

                                {activePage > 0 ? (
                                    <li onClick={handelPreviousPage}>
                                        <div className="flex py-2 px-3 ml-0 text-gray-500 cursor-pointer bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 ">
                                            <span className="sr-only">Previous</span>
                                            <NavigateBeforeIcon />
                                        </div>
                                    </li>
                                ) : (
                                    <li>
                                        <div className="flex py-2 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300">
                                            <span className="sr-only">Previous</span>
                                            <NavigateBeforeIcon />
                                        </div>
                                    </li>
                                )}

                                {postPages.map((item: number, index: number) => (
                                    <li key={index}>
                                        <div onClick={() => handelToPage(index)} className={`py-2 px-3 ${activePage === index ? " text-gray-100 bg-gray-500  hover:bg-gray-600" : "hover:bg-gray-100 text-gray-500 cursor-pointer bg-white "} border border-gray-300  `}>{index + 1}</div>
                                    </li>
                                ))}

                                {activePage < (postPages.length - 1) ? (
                                    <li onClick={handelNextPage}>
                                        <div className="flex py-2 px-3 ml-0 text-gray-500 cursor-pointer bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 ">
                                            <span className="sr-only">Next</span>
                                            <NavigateNextOutlinedIcon />
                                        </div>
                                    </li>
                                ) : (
                                    <li >
                                        <div className="flex py-2 px-3 ml-0 text-gray-500 bg-white rounded-r-lg border border-gray-300">
                                            <span className="sr-only">Next</span>
                                            <NavigateNextOutlinedIcon />
                                        </div>
                                    </li>
                                )}

                            </ul>
                        </nav>
                    </>
                ) : (
                    <Typography variant='h4'>No Posts Found</Typography>
                ) : (
                    <Box className="flex items-center justify-center">
                        <CircularProgress />
                    </Box>
                )}
            </div>
        </Box>
    );
};