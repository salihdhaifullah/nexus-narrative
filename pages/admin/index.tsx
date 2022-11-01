import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { GetAdminPageData } from '../../api';
import Link from 'next/link';
import Button from '@mui/material/Button';

interface IPost {
  slug: string
  views: number
  title: string
  id: number
}

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [blogName, setBlogName] = useState("");
  const [posts, setPosts] = useState<IPost[]>([])


  const handelGetData = async () => {
    setIsLoading(true)
    await GetAdminPageData().then((res) => {
      setPosts(res.data.data.posts)
      setBlogName(res.data.data.blogName)
      setIsLoading(false)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    handelGetData();
  }, [])

  return (
    <>
      <div className='flex mt-4 ml-4'>
        <Link href="admin/create-post">
          <Button variant="contained" className="bg-blue-600">
            Create New Post
          </Button>
        </Link>
      </div>
      <div className="p-16 w-full min-h-[100vh] flex justify-center">
        {isLoading ? <CircularProgress /> :
          (posts && posts.length > 0) && (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>slug</TableCell>
                    <TableCell align="right">views</TableCell>
                    <TableCell align="right">title</TableCell>
                    <TableCell align="right">update</TableCell>
                    <TableCell align="right">delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.slug} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <Link href={`/${blogName}/posts/${post.slug}`}>
                        <TableCell className="link" component="th" scope="row">
                          {post.slug}
                        </TableCell>
                      </Link>
                      <TableCell align="right">{post.views}</TableCell>
                      <TableCell align="right">{post.title}</TableCell>
                      <TableCell align="right" className="link">update</TableCell>
                      <TableCell align="right" className="link">delete</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
      </div >
    </>
  );
}