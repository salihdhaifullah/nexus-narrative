import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import Box from '@mui/material/Box'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState, useCallback } from 'react'
import { GetPosts } from '../api'

interface IPost {
  author: {
    blogName: string;
  }
  slug: string;
  title: string;
  createdAt: Date;
  backgroundImage: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  const init = useCallback(async () => {
    await GetPosts().then((res) => {setPosts(res.data.posts) });
  }, []);

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="min-w-full w-full min-h-[80vh] block p-10 py-20">
      {posts.length ? posts.map((post, index) => (
        <Grid key={index} item className="min-w-full w-full mb-4">
          
          <Link href={`/${post.author.blogName}/posts/${post.slug}`}>
            <CardActionArea component="a">
              <Card className="min-w-full flex w-full">
                <CardContent className="flex-1">
                  <Typography component="h2" variant="h5">
                    {post.title}
                  </Typography>
                  <Typography component="p" variant="body2">
                    {moment(post.createdAt).format('ll')}
                  </Typography>

                  <Typography variant="subtitle1" color="primary">
                    Continue reading...
                  </Typography>

                </CardContent>
                <CardMedia
                  component="img"
                  className="w-20"
                  image={post.backgroundImage}
                  alt={post.title}
                />
              </Card>
            </CardActionArea>
          </Link>
        </Grid>
      )) : (
        <Box className="w-full text-gray-900 text-center h-full items-center">
          <Typography variant='h3'>No Posts Found</Typography>
        </Box>
      )}
    </div>
  )
}

export default Posts;