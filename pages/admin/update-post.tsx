import React, { useEffect, useState } from 'react'
import MdEditorCom from '../../components/MdEditorCom'
import Head from 'next/head'
import { GetPostToUpdate } from '../../api'


interface IPostToUpdateData {
    content: string;
    slug: string;
    backgroundImageUrl: string;
    category: {
      name: string;
    };
    title: string;
    tags: {
      name: string;
    }[];
}
const UpdatePost = () => {
  const [postId, setPostId] = useState<number | null>(null);
  const [postToUpdateData, setPostToUpdateData] = useState<IPostToUpdateData | undefined>(undefined);

  const handelGetPostToUpdate = async () => {
    if (typeof postId !== 'number') return;
    await GetPostToUpdate(postId).then((res) => {
      setPostToUpdateData(res.data.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    if (window) setPostId(Number(window.location.href.split("?id=")[1]));  
  }, [])
  
  useEffect(() => {
    handelGetPostToUpdate()
  }, [postId])

  return (
    <>
    <Head>
        <title>|~ Update Post</title>
    </Head>
    {postToUpdateData && (
      <MdEditorCom isUpdate={true} postId={postId} data={postToUpdateData}></MdEditorCom>
    )}
    </>
  )
}

export default UpdatePost