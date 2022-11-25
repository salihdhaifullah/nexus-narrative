import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import moment from 'moment';
import Link from 'next/link';
import { IFeaturedPostProps } from '../types/post';

interface IProps {
  post: IFeaturedPostProps
}

export default function FeaturedPost(props: IProps) {
  const { post } = props;
  return (
    <div className="min-w-full w-full block">
      <Grid item className="min-w-full w-full">
        <Link href={`/${post.author.blogName}/posts/${post.slug}`}>
          <CardActionArea component="a" href="#">
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
                image={post.backgroundImage}
                alt={post.title}
              />
            </Card>
          </CardActionArea>
        </Link>
      </Grid>
    </div>
  );
}