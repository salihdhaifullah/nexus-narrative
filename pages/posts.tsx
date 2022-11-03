import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { GetPosts } from '../api'


interface IPost {
  author: {
    blogName: string;
  }
  slug: string;
  title: string;
  createdAt: Date;
  backgroundImageUrl: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  const Init = async () => {
    await GetPosts().then((res) => {
      console.log(res.data.posts)
      setPosts(res.data.posts)
    }).catch((err) => {
      console.log(err)
    });
  }

  useEffect(() => {
    Init()
  }, [])

  return (
    <div className="min-w-full w-full block p-10 py-20">
      {posts && posts.map((post, index) => (
        <Grid key={index} item className="min-w-full w-full mb-4">
          <Link href={`/${post.author.blogName}/posts/${post.slug}`}>
            <CardActionArea component="a" >
              <Card sx={{ display: 'flex' }} className="min-w-full w-full">
                <CardContent sx={{ flex: 1 }}>
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
                  sx={{ width: 100, display: { xs: 'none', sm: 'block' } }}
                  image={post.backgroundImageUrl}
                  alt={post.title}
                />
              </Card>
            </CardActionArea>
          </Link>
        </Grid>
      ))}
    </div>
  )
}

export default Posts