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
import Dialog from '@mui/material/Dialog';
import Chip from '@mui/material/Chip';
import DialogTitle from '@mui/material/DialogTitle';
import FilterListIcon from '@mui/icons-material/FilterList'
import DoneIcon from '@mui/icons-material/Done'


export default function Posts({ postsInit, categories }: { postsInit: IPost, categories: { name: string }[] }) {
    const [isLoading, setIsLoading] = useState(false);

    const [open, setOpen] = useState(false);
    const [posts, setPosts] = useState(postsInit.posts)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sort, setSort] = useState<"views" | "likes" | "dislikes" | "date" | undefined>(undefined)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState<string | undefined>(undefined)
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
        if (open) return;
        if (isFirstRender.current) {
            isFirstRender.current = false
            return;
        }

        setIsLoading(true)
        await getPostsTable(postsInit.blogName, page, rowsPerPage, sort, title, category)
            .then((res) => { setPosts(res.data.posts.posts) })
            .catch((err) => { console.log(err) })
            .finally(() => { setIsLoading(false) })
    }, [open, page, rowsPerPage])

    useEffect(() => {
        handelGetPosts()
    }, [handelGetPosts])

    return (
        <Box className='flex flex-col justify-center items-center mx-4 mb-10'>
            <div className="flex w-full flex-col items-start gap-4 mt-10 justify-start">
                <h1 className='text-3xl text-gray-800 font-bold mb-4'>Posts</h1>

                <Paper className="w-full overflow-auto">

                    <Box className="flex justify-between w-full items-center">

                    <Link href='/create-post'>
                        <Box className="w-fit h-fit border m-1 z-[101] rounded-md">
                            <Button className="hover:shadow-lg z-[100] transition-all hover:shadow-blue-500">
                                Create a Post
                            </Button>
                        </Box>
                    </Link>


                    <FilterListIcon onClick={() => setOpen(true)} className="text-gray-600 mt-1 mr-1 cursor-pointer hover:bg-slate-100  rounded-md p-2  w-12 h-12" />

                    <Dialog onClose={() => setOpen(false)} open={open}>
                        <Box className="p-4 flex flex-col gap-4">
                            <section className="gap-1 flex max-w-[600px] flex-row">
                            <span>Sort By: </span>
                                <div className="flex flex-row flex-wrap gap-2">
                                    <Chip clickable label="views" variant="outlined" icon={sort === "views" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "views" ? setSort(undefined) : setSort("views")} />
                                    <Chip clickable label="likes" variant="outlined" icon={sort === "likes" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "likes" ? setSort(undefined) : setSort("likes")} />
                                    <Chip clickable label="dislikes" variant="outlined" icon={sort === "dislikes" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "dislikes" ? setSort(undefined) : setSort("dislikes")} />
                                    <Chip clickable label="date" variant="outlined" icon={sort === "date" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "date" ? setSort(undefined) : setSort("date")} />
                                </div>
                            </section>


                            <section className="h-full justify-start flex items-center gap-4 flex-row">
                            <span>Filter: </span>
                                <label htmlFor='title' className="sr-only">title</label>
                                <input id="title" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='title' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </section>

                             <div className="flex flex-row w-[300px]">
                                <label htmlFor="category" className="text-sm w-[180px] text-center font-medium text-gray-700">category</label>
                                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                                    <option value={""}>-all-</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        </Box>
                    </Dialog>
                    </Box>
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
                                            <TableCell className="text-base min-w-[120px]">category</TableCell>
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
                                                <TableCell>{post.category.name}</TableCell>
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
