import React from 'react'
import Blog from '../../components/Blog'
import { getAllBlogsName, getBlogData } from '../../controllers'

const index = () => {
  return (
    <div><Blog /></div>
  )
}

export default index

export async function getStaticPaths() {
  const paths = await getAllBlogsName();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const blogData = await getBlogData(params.blogName);
  return {
    props: {
      blogData,
    },
  };
}