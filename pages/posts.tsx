import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import React, { useEffect, useState, useCallback } from 'react'
import { GetPosts, GetPostsLength, GetTagsAndCategories } from '../api'
import { IFeaturedPostProps, SortByType } from '../types/post'
import FeaturedPost from '../components/FeaturedPost'
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'


const Posts = () => {
  const [posts, setPosts] = useState<IFeaturedPostProps[]>([]);
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(5);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<SortByType>("CreateAt");
  const [postPages, setPostsPages] = useState<number[]>([]);
  const [activePage, setActivePage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const [categoriesOptions, setCategoriesOptions] = useState<{ name: string }[]>([]);

  const init = useCallback(async () => {
    await GetPostsLength(filter)
      .then((res) => {
        const pages = [];
        for (let i = 0; i < Math.ceil(res.data.length / take); i++) { pages.push(i) };
        setPostsPages(pages)
      })
      .catch((err) => { console.error(err) });
  }, [filter, take])


  useEffect(() => {
    init()
  }, [init])

  const getPostsPagination = useCallback(async () => {
    setIsLoading(true)
    await GetPosts(skip, take, filter, sortBy)
      .then(async (res) => {
        setPosts(res.data.posts)
        if (res.data.posts) setIsLoading(false);
      })

    setIsLoading(false);
  }, [filter, skip, sortBy, take])

  useEffect(() => {
    getPostsPagination()
  }, [getPostsPagination])

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

  const GetCategories = useCallback(async () => {
    await GetTagsAndCategories()
      .then((res) => {
        if (!res.data.categories.length) return;
        setCategoriesOptions(res.data.categories)
      });
  }, [])

  useEffect(() => {
    GetCategories()
  }, [GetCategories])


  return (
    <div className="min-w-full w-full min-h-[80vh] block p-10">

      <Box className="flex w-full mb-10 justify-end items-end gap-4">
        <div className="w-full"></div>
        <div className="w-full"></div>

        <Box className="w-full inline-flex gap-4 p-4 rounded-md shadow-lg bg-white">
          <FormControl className="w-full">
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value as SortByType)}
            >

                <MenuItem value={"Views"}>Views</MenuItem>
                <MenuItem value={"Likes"}>Likes</MenuItem>
                <MenuItem value={"CreateAt"}>Create At</MenuItem>

            </Select>
          </FormControl>

          <FormControl className="w-full">
            <InputLabel id="demo-simple-select-label">Filter</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter === undefined ? "--all--" : filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value === "--all--" ? undefined : e.target.value)}
            >
              <MenuItem value={"--all--"} >--all--</MenuItem>

              {categoriesOptions.map((option, index) => (
                <MenuItem value={option.name} key={index}>{option.name}</MenuItem>
              ))}

            </Select>
          </FormControl>

        </Box>

      </Box>

      {isLoading ? (
        <div className="w-full mt-20 flex justify-center items-center">
          <CircularProgress className="w-12 h-12"/>
        </div>
      ) : posts.length ? (

        <Grid>
          <Box className="gap-4 grid w-full grid-cols-1 mb-10 sm:grid-cols-2 ">
            {posts.map((post, index) => (
              <div key={index} className="w-full">
                <FeaturedPost post={post} />
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

        </Grid>

      ) : (

        <Box className="w-full text-gray-900 text-center h-full items-center">
          <Typography variant='h4'>No Posts Found</Typography>
        </Box>

      )}
    </div>
  )
}

export default Posts;