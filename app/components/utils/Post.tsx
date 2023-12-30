import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from 'next/link';
import { IPostProps } from '../../types/post';
import dateFormat from '../../utils/dateFormat';
import Box from '@mui/material/Box';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import CommentIcon from '@mui/icons-material/Comment';

export default function Post({ post }: { post: IPostProps }) {

  return (
    <div className="w-full flex h-[200px]">
      <Grid item className="w-full h-[200px]">

        <Link href={`/${post.author.blogName}/posts/${post.slug}`}>
          <CardActionArea className="relative h-[200px]">
            <Card className="flex w-full h-full items-start">

              <CardContent className="flex-1 h-[200px] flex flex-col justify-between">
                <Box className="flex flex-col">

                  <Typography component="h2" variant="h5">
                    {post.title}
                  </Typography>

                  <Typography component="p" variant="body2">
                    {dateFormat(post.createdAt)}
                  </Typography>


                  <Typography component="p" variant="body2">
                    {post.description.length > 150 ? `${post.description.substring(0, 150)}...` : post.description}
                  </Typography>


                  <Typography variant="subtitle1" color="primary">
                    Continue reading...
                  </Typography>
                </Box>

                <Box className="flex flex-row gap-4 justify-center">
                  <div className="hover:bg-gray-200 cursor-default text-blue-500 rounded-full p-2">
                    <ThumbUpOffAltIcon /> {post.likesCount}
                  </div>

                  <div className="hover:bg-gray-200 cursor-default text-blue-500 rounded-full p-2">
                    <ThumbDownOffAltIcon /> {post.dislikesCount}
                  </div>

                  <div className="hover:bg-gray-200 cursor-default text-blue-500 rounded-full p-2">
                    <CommentIcon /> {post._count.comments}
                  </div>

                </Box>
              </CardContent>

              <CardMedia
                component="img"
                className="object-contain h-auto max-w-[200px] w-full"
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
