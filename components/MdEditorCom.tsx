import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import supabase from '../libs/supabase/config'
import { useEffect, useState, useMemo, useRef } from 'react'
import Swal from 'sweetalert2'

interface Files {
  name: string
  fileUrl: string
  file: File
  previewUrl: string
}

interface HandleEditorChangeProps {
  html: string
  text: string
}


const MdEditorCom = () => {
  const mdParser = new MarkdownIt();
  const mdEditorRef: any = useRef()

  const [text, setText] = useState<string>("");
  const [previewsUrl, setPreviewsUrl] = useState<string[]>([]);
  const [data, setData] = useState<Files[]>([])

  const handleEditorChange = ({ html, text }: HandleEditorChangeProps) => {
    setText(text)
  }

  const onImageUpload = async (file: File) => {
    if (file.size > 52428800) Swal.fire('some think want wrong', 'file size is to big', 'error')
    else {
      const previewUrl = URL.createObjectURL(file)
      previewsUrl.push(previewUrl)
      setPreviewsUrl(previewsUrl)
            
      const name: string = Date.now().toString() + file?.name;
      
      const fileUrl: string = 'https://nvyulqjjulqfqxirwtdq.supabase.co/storage/v1/object/public/public/' + name;
      
      const NewObjectFile: Files = { name, fileUrl, file, previewUrl }
      
      data.push(NewObjectFile)
      
      setData(data)
      return previewUrl
    }

  }

// todo 
//   1- title = input ✔
//   2- content = text ✔
//   3- tags = input ❌
//   4- slug = input ✔
//   5- category = input ❌ 
//   6- images = dataArray ✔ 
// 


  const HandelSubmit = async () => {
    for (let i = 0; i < data.length; i++) {

      if (text.includes(data[i].previewUrl)) {

        const {data: success, error} = await supabase.storage.from("public").upload(data[i].name, data[i].file)
        if (error) Swal.fire('some think want wrong', 'place check internet connection', 'error')
        else  setText(text.replace(previewsUrl[i], data[i].fileUrl));


      } else {
        URL.revokeObjectURL(previewsUrl[i])
      }
    } 

    console.log(text);
    mdEditorRef.current.nodeMdText.current.value = ""; // this is the textarea input from MdEditor component
    setText("")
    setPreviewsUrl([])
  }


  return (
    <>
      <div className='fixed top-[540px] right-[40px] z-10 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 text-white'>
        <button className='px-2 py-5 text-[16px]' onClick={HandelSubmit}>
          Submit
        </button>
      </div>
      <MdEditor
        ref={mdEditorRef}
        style={{ height: '500px' }}
        renderHTML={text => mdParser.render(text)}
        onChange={handleEditorChange}
        onImageUpload={onImageUpload}
      />
    </>
  );
}

export default MdEditorCom;