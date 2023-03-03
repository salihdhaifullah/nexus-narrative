import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useEffect, useState, useCallback } from 'react'
import { GetPosts, GetPostsLength, GetTagsAndCategories } from '../api'
import { IPostProps, SortByType } from '../types/post'
import Post from '../components/utils/Post'
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'


const Posts = () => {
  const [posts, setPosts] = useState<IPostProps[]>([]);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(false)

  const getPostsPagination = useCallback(async () => {
    setIsLoading(true)
    await GetPosts(skip, 5, undefined, undefined)
      .then(async (res) => {
        setPosts(res.data.posts)
        if (res.data.posts) setIsLoading(false);
      })

    setIsLoading(false);
  }, [skip])

  useEffect(() => {
    getPostsPagination()
  }, [getPostsPagination])


  return (
    <div className="min-w-full w-full min-h-[80vh] block p-10">

      {isLoading ? (
        <div className="w-full mt-20 flex justify-center items-center">
          <CircularProgress className="w-12 h-12"/>
        </div>
      ) : posts.length ? (
        <Grid>
          <Box className="gap-4 grid w-full grid-cols-1 mb-10 sm:grid-cols-2 ">
            {posts.map((post, index) => (
              <div key={index} className="w-full">
                <Post post={post} />
              </div>
            ))}
          </Box>
        </Grid>
      ) : <Box className="w-full text-gray-900 text-center h-full items-center">
          <Typography variant='h4'>No Posts Found</Typography>
        </Box> }
    </div>
  )
}

export default Posts;
