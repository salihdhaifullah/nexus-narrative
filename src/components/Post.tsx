import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from 'next/link';
import { IPostProps } from '../types/post';
import dateFormat from '../utils/dateFormat';

export default function Post(props: {post: IPostProps }) {
  const { post } = props;

  return (
    <div className="w-full flex">
      <Grid item className="w-full">

        <Link href={`/${post.author.blogName}/posts/${post.slug}`}>
          <CardActionArea>
            <Card className="flex w-full">

              <CardContent className="flex-1">

                <Typography component="h2" variant="h5">
                  {post.title}
                </Typography>

                <Typography component="p" variant="body2">
                  {dateFormat(post.createdAt)}
                </Typography>

                {post.description ? (
                  <Typography component="p" variant="body2">
                    {post.description.substring(0, 30)}
                  </Typography>
                ) : null}

                <Typography variant="subtitle1" color="primary">
                  Continue reading...
                </Typography>

              </CardContent>

              <CardMedia
                component="img"
                sx={{ width: 100 }}
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
