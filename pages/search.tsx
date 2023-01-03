import { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Post from '../components/Post'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { generalSearch, GetSearchLength, SearchByCategory, SearchByTag } from '../api'
import { IPostProps } from '../types/post'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';


const Search = () => {
    const [posts, setPosts] = useState<IPostProps[] | null>(null);
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tag, setTag] = useState("")
    const [category, setCategory] = useState("")
    const [skip, setSkip] = useState(0);
    const [take, setTake] = useState(5);
    const [activePage, setActivePage] = useState(0);
    const [postsPages, setPostsPages] = useState<number[]>([]);

    const router = useRouter();

    useEffect(() => {
        setSearch(window.location.href.split("?search=")[1])
        setTag(window.location.href.split("?tag=")[1])
        setCategory(window.location.href.split("?category=")[1])
    }, [router])


    const init = useCallback(async () => {
        if (search) {
            await GetSearchLength("search", search)
                .then((res) => {
                    const pages = [];
                    for (let i = 0; i < Math.ceil(res.data.posts / take); i++) { pages.push(i) };
                    setPostsPages(pages)
                })
                .catch((err) => { console.error(err) });
        }
        else if (tag) {
            await GetSearchLength("tag", tag)
                .then((res) => {
                    const pages = [];
                    for (let i = 0; i < Math.ceil(res.data.posts / take); i++) { pages.push(i) };
                    setPostsPages(pages)
                })
                .catch((err) => { console.error(err) });
        }
        else if (category) {
            await GetSearchLength("category", category)
                .then((res) => {
                    const pages = [];
                    for (let i = 0; i < Math.ceil(res.data.posts / take); i++) { pages.push(i) };
                    setPostsPages(pages)
                })
                .catch((err) => { console.error(err) });
        }
    }, [category, search, tag])


    useEffect(() => {
        init()
    }, [init])

    const handelNextPage = () => {
        const page = (activePage + 1);
        if (activePage < (postsPages.length - 1)) setActivePage(page);
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

    const handelSearch = useCallback(async () => {
        if (tag || search || category) setIsLoading(true);

        if (search) await generalSearch(search, skip, take)
            .then((res) => {
                setPosts(res.data.posts);
                if (res.data.posts) setIsLoading(false)
            })

        else if (tag) await SearchByTag(tag, skip, take)
            .then((res) => {
                setPosts(res.data.posts.posts);
                if (res.data.posts.posts) setIsLoading(false)
            })

        else if (category) await SearchByCategory(category, skip, take)
            .then((res) => {
                setPosts(res.data.posts);
                if (res.data.posts) setIsLoading(false)
            })
    }, [category, search, skip, tag, take])



    useEffect(() => {
        handelSearch();
    }, [handelSearch])

    return (
        <>
            <Head>
                <title>{search || tag || category}</title>
                <meta name="description" content={search || tag || category} />
                <meta name="keywords" content={search || tag || category} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="w-full min-h-[75vh] flex my-10 p-16 min-w-full justify-center items-center">
                {isLoading ? <CircularProgress /> : (
                    <Grid container spacing={4}>
                        {(posts && posts.length > 0) ? (
                            <>
                                <Box className="gap-4 grid w-full grid-cols-1 sm:grid-cols-2 ">

                                    {posts.map((post) => (
                                        <div key={post.title} className="w-full">
                                            <Post key={post.title} post={post} />
                                        </div>
                                    ))}


                                </Box>

                                <nav aria-label="Page navigation" className="mt-[200px] min-w-full flex justify-center items-center">
                                    <ul className="flex items-center">

                                        {activePage > 0 ? (
                                            <li onClick={handelPreviousPage}>
                                                <div className="flex py-2 px-3 ml-0 text-gray-500 cursor-pointer bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 ">
                                                    <span className="sr-only" title="Previous">Previous</span>
                                                    <NavigateBeforeIcon />
                                                </div>
                                            </li>
                                        ) : (
                                            <li>
                                                <div className="flex py-2 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300">
                                                    <span className="sr-only" title="Previous">Previous</span>
                                                    <NavigateBeforeIcon />
                                                </div>
                                            </li>
                                        )}

                                        {postsPages.map((item: number, index: number) => (
                                            <li key={index}>
                                                <div onClick={() => handelToPage(index)} className={`py-2 px-3 ${activePage === index ? " text-gray-100 bg-gray-500  hover:bg-gray-600" : "hover:bg-gray-100 text-gray-500 cursor-pointer bg-white "} border border-gray-300  `}>{index + 1}</div>
                                            </li>
                                        ))}

                                        {activePage < (postsPages.length - 1) ? (
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
                            <div className="w-full flex items-center justify-center">
                                <Typography variant='h4' component='h1'> Sorry No Posts Found </Typography>
                            </div>
                        )}
                    </Grid>
                )}
            </div>
        </>
    )
}

export default Search;
