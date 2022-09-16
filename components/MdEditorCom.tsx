import React from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import supabase from '../libs/supabase/config'
import {useEffect, useState, useMemo} from 'react'
import Swal from 'sweetalert2'

const MdEditorCom = () => {
  const mdParser = new MarkdownIt();
  const handleEditorChange = ({ html, text }: any) => console.log('handleEditorChange', html, text);
  

  const onImageUpload = async (file: File) => {
    if (file.size > 52428800) Swal.fire('some think want wrong', 'file size is to big', 'error')
    else {
      const name: string = Date.now().toString() + file?.name;
      // const fileUrl: string = 'https://nvyulqjjulqfqxirwtdq.supabase.co/storage/v1/object/public/public/' + name;
      // const {data, error} = await supabase.storage.from("public").upload(name, file)
      
      // if (error) Swal.fire('some think want wrong', 'place check internet connection', 'error')
      return file;
    }

  }
  


  const HandelSubmit = () => {
    console.log("HandelSubmit");
  }


  return (
    <>
    <div className='fixed top-[540px] right-[40px] z-10 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 text-white'>
      <button className='px-2 py-5 text-[16px]' onClick={HandelSubmit}>
        Submit
      </button>
    </div>
    <MdEditor 
    style={{ height: '500px' }}
    renderHTML={text => mdParser.render(text)}
    onChange={handleEditorChange}
    onImageUpload={onImageUpload} 
    />
    </>
  );
}

export default MdEditorCom;