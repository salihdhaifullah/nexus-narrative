import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useEffect, useState, useCallback, useRef } from 'react'
import { GetPosts } from '../api'
import { IPostProps } from '../types/post'
import Post from '../components/utils/Post'
import FilterListIcon from '@mui/icons-material/FilterList';
import DoneIcon from '@mui/icons-material/Done';
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import prisma from '../libs/prisma'
import { useRouter } from 'next/router'

interface IOption { name: string }
const Posts = ({ tags, categories }: { tags: IOption[], categories: IOption[] }) => {

  const [posts, setPosts] = useState<IPostProps[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [tag, setTag] = useState("")
  const [category, setCategory] = useState("")
  const [isLoadingRow, setIsLoadingRow] = useState(false)
  const [count, setCount] = useState(0)
  const [sort, setSort] = useState<"date" | "likes" | "views" | undefined>(undefined)

  const router = useRouter()
  const isFirstRender = useRef(true)


  const getPostsInit = async (category?: string, tag?: string, search?: string, sort?: string) => {
    setIsLoading(true)
    await GetPosts(0, category, tag, search, sort)
      .then((res) => {
        setPosts(res.data.posts)
        setCount(res.data.count)
      })
      .catch((err) => { console.log(err) })
      .finally(() => { setIsLoading(false) })
  }

  useEffect(() => {
    setPage(1)
    setCount(0)

    const category = typeof router.query["category"] !== "string" ? "" : router.query["category"]
    const tag = typeof router.query["tag"] !== "string" ? "" : router.query["tag"]
    const search = typeof router.query["search"] !== "string" ? "" : router.query["search"]

    let sort = undefined
    const data = router.query["sort"];
    const options = ["date", "likes", "views"]
    if (typeof data === "string" && options.includes(data)) sort = data;

    setSearch(search)
    setTag(tag)
    setCategory(category)
    // @ts-ignore
    setSort(sort)

    getPostsInit(category, tag, search, sort)
  }, [router.query])



  useEffect(() => {
    if (open) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    router.push(`/posts/?search=${search}&tag=${tag}&category=${category}&sort=${sort || ""}`)
  }, [open])


  const getPosts = async () => {
    setIsLoadingRow(true)
    await GetPosts(page, category, tag, search, sort)
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data.posts])
        setCount(res.data.count)
        setPage((prev) => (prev + 1))
       })
      .catch((err) => { console.log(err) })
      .finally(() => { setIsLoadingRow(false) })
  }


  const [state, setState] = useState(false)
  const [ele, setEle] = useState<Element | null>(null)
  const observer = useRef<IntersectionObserver | null>(null)

  const eleCallBack = useCallback((node: HTMLDivElement) => { setEle(node) }, [])

  useEffect(() => {
      observer.current = new IntersectionObserver((entries) => { setState(entries[0].isIntersecting) })
  }, [])

  useEffect(() => { if (ele) observer.current?.observe(ele) }, [ele])

  useEffect(() => {
      if (posts.length !== count && !isLoadingRow && !isLoading && state) getPosts();
  }, [state])

  return (
    <div className="min-w-full w-full min-h-[80vh] block p-10">
      <Box className="text-white cursor-pointer fixed top-20 z-50 left-1  bg-gradient-to-tr hover:from-gray-800  hover:to-gray-500 from-gray-700 to-gray-400 shadow-md rounded-md">
        <FilterListIcon onClick={() => setOpen(true)} className="p-2 w-12 h-12" />
      </Box>

      <Dialog
        onClose={() => setOpen(false)}
        onKeyDown={(e) => { if (e.key === 'Enter') setOpen(false) }}
        open={open}
      >
        <DialogTitle>Sort And Filter</DialogTitle>
        <Box className="p-4 flex flex-col gap-4">
          <section className="gap-4 max-w-[400px] flex-col">
            <div className="flex flex-row flex-wrap gap-2">
              <Chip clickable label="likes" variant="outlined" icon={sort === "likes" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "likes" ? setSort(undefined) : setSort("likes")} />
              <Chip clickable label="views" variant="outlined" icon={sort === "views" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "views" ? setSort(undefined) : setSort("views")} />
              <Chip clickable label="date" variant="outlined" icon={sort === "date" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "date" ? setSort(undefined) : setSort("date")} />
            </div>
          </section>

          <section className="h-full justify-start flex items-center gap-4 flex-col">
            <label htmlFor='search' className="sr-only ">search</label>
            <input id="search" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='search' value={search} onChange={(e) => setSearch(e.target.value)} />


            <div className="flex flex-row w-full">
              <label htmlFor="categories" className="text-sm w-[180px] text-center font-medium text-gray-700">category</label>
              {/* @ts-ignore */}
              <select id="categories" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option value={""}>-all-</option>
                {!(categories && categories.length > 0) ? null : categories.map((category, index) => (
                  <option value={category.name} key={index}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-row w-full">
              <label htmlFor="tags" className="text-sm w-[180px] text-center font-medium text-gray-700">tag</label>
              {/* @ts-ignore */}
              <select id="tags" value={tag} onChange={(e) => setTag(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option value={""}>-all-</option>
                {!(tags && tags.length > 0) ? null : tags.map((tag, index) => (
                  <option value={tag.name} key={index}>{tag.name}</option>
                ))}
              </select>
            </div>

          </section>
        </Box>
      </Dialog>

      {isLoading ? (
        <div className="w-full mt-20 flex justify-center items-center">
          <CircularProgress className="w-12 h-12" />
        </div>
      ) : posts.length ? (
        <Grid>
          <Box className="gap-4 flex flex-col justify-center items-center w-full mb-10 ">
            {posts.map((post, index) => (
              <div key={index} className="w-[600px]">
                <Post post={post} />
              </div>
            ))}
            <div ref={eleCallBack} className="min-h-[100px] w-full flex justify-center items-center"> {isLoadingRow ? <CircularProgress className="w-12 h-12" /> : null} </div>
          </Box>
        </Grid>
      ) : <Box className="w-full text-gray-900 text-center h-full items-center">
        <Typography variant='h4'>No Posts Found</Typography>
      </Box>}
    </div>
  )
}

export default Posts;


export async function getServerSideProps() {

  const [tags, categories] = await prisma.$transaction([
    prisma.tag.findMany({ select: { name: true } }),
    prisma.category.findMany({ select: { name: true } })
  ])

  return { props: { tags, categories } }
}


