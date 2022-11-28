import Head from 'next/head'
import { GetPostToUpdate } from '../../api'
import MdEditor from 'react-markdown-editor-lite';
import { useEffect, useState, useRef, useCallback } from 'react'
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { GetTagsAndCategories, UpdatePost } from '../../api';
import { IUpdatePostData } from '../../types/post';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router'
import Toast from '../../functions/sweetAlert';
import toBase64 from '../../functions/toBase64';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import mdParser from '../../libs/markdown';


interface HandleEditorChangeProps {
  html: string
  text: string
}

interface IOptions {
  name: string
  inputValue?: string
}

interface IImagesData {
  fileName: string;
  base64: string;
  preViewUrl: string;
}

const filter = createFilterOptions<IOptions>();

const UpdatePostPage = () => {
  const mdEditorRef: any = useRef();
  const router = useRouter()

  const [tagsOptions, setTagsOptions] = useState<IOptions[]>([])
  const [categoriesOptions, setCategoriesOptions] = useState<IOptions[]>([])


  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<IOptions | null>(null)
  const [images, setImages] = useState<IImagesData[]>([])
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [postId, setPostId] = useState<number | null>(null);

  const handelGetPostToUpdate = useCallback(async () => {
    if (typeof postId !== 'number') return;
    const tagsData: string[] = [];
    await GetPostToUpdate(postId)
      .then((res) => {
        if (!res.data.data) return;
        setText(res.data.data.content)
        mdEditorRef.current.state.text = res.data.data.content; 
        mdEditorRef.current.state.html = mdParser(res.data.data.content);
        setCategory(res.data.data.category)
        for (let tag of res.data.data.tags) {
          tagsData.push(tag.name)
        }
        setTags(tagsData)
        setTitle(res.data.data.title)
       })
      .catch((err) => { console.log(err) })
  }, [postId])


  useEffect(() => {
    setPostId(Number(window.location.href.split("?id=")[1]));
  }, [])

  useEffect(() => {
    handelGetPostToUpdate()
  }, [handelGetPostToUpdate])




  const handleEditorChange = ({ html, text }: HandleEditorChangeProps) => setText(text);

  useEffect(() => {
    if (title.length > 7 && text.length > 99 && (category && category.name.length > 2) && tags.length > 1) {
      setIsValid(true)
    } else setIsValid(false);
  }, [category, tags, text, title])


  const init = useCallback(async () => {
    await GetTagsAndCategories()
      .then((res) => {
        if (!res.data.categories.length) return;
        setCategoriesOptions(res.data.categories)
        setTagsOptions(res.data.tags)
      });
  }, [])

  useEffect(() => {
    init()
  }, [init])


  useEffect(() => {
    setIsLoading(false)
  }, [])

  const onImageUpload = async (file: File) => {
    const imagesData = images;
    const preViewUrl = URL.createObjectURL(file);
    const base64: string = await toBase64(file) as string;

    imagesData.push({ base64, fileName: file.name, preViewUrl })
    setImages(imagesData);

    return preViewUrl;
  }


  const HandelSubmit = async () => {
    let imagesThatUsed = [];
    if (!isValid || !category?.name || !postId) return;

    setIsLoading(true)

    for (let i = 0; i < images.length; i++) {
      if (text.includes(images[i].preViewUrl)) imagesThatUsed.push(images[i]);

      URL.revokeObjectURL(images[i].preViewUrl);
    }

    const data: IUpdatePostData = { title, content: text, images: imagesThatUsed, tags, category: category.name }

    await UpdatePost(postId, data)
      .then((res) => { 
        Toast.fire(res.data.massage || 'success post Updated', '', 'success')
        router.push(res.data.postUrl)

        setTitle("")
        setTags([])
        setCategory({ name: "" })
        mdEditorRef.current.state.text = ""; // this is the textarea input state from MdEditor component
        mdEditorRef.current.state.html = ""; // this is the textarea input state from MdEditor component
        setText("")
        imagesThatUsed = []
        setIsLoading(false)
      })
      .catch((err) => { Toast.fire(err.response.data.massage || 'Some Thing Wrong!', '', 'error') })
    setIsLoading(false)
  }


  return (
    <>
      <Head>
        <title>|~ Update Post</title>
      </Head>
      {!postId ? null : (
        <>
          <div className={`fixed bottom-[40px] right-[40px] z-10 rounded-full shadow-md  
              ${isValid ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : "bg-gray-400 cursor-not-allowed hover:bg-gray-300"} 
              text-white`}>

            {(isLoading) ? (
              <div className='text-white px-2.5 py-1.5 text-[16px]'>
                <CircularProgress className='text-white ' />
              </div>
            ) : (
              <div className='px-2 py-5 text-[16px]' onClick={HandelSubmit}>
                Submit
              </div>
            )}
          </div>
          <Container>
            <Box className='px-6 my-2 rounded-md shadow-md bg-white py-4'>
              <Box className="flex flex-col sm:flex-row flex-wrap w-full sm:mb-2">

                <div className='w-full sm:w-auto flex-1 mb-2 sm:mb-0' >
                  <TextField
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                    fullWidth
                    id="title"
                    label="title"
                    name="title"
                    autoFocus
                  />
                  {(title.length < 8) && (
                    <p className="text-red-600 text-sm font-light">
                      min length of title is 8
                    </p>
                  )}
                </div>

              </Box>

              <Stack className="flex flex-col sm:flex-row w-full flex-wrap mb-4">

                <div className='w-full flex-col sm:w-auto flex-[2] flex mb-2 sm:mb-0'>
                  <Autocomplete
                    className='w-full sm:w-auto flex-[2] flex mb-2 sm:mb-0'
                    multiple
                    id="tags-filled"
                    options={tagsOptions.map((option) => option.name)}
                    freeSolo
                    value={tags}
                    onChange={(event, value) => setTags(value)}
                    renderTags={(value: readonly string[], getTagProps) =>
                      value.map((option: string, index: number) => (
                        // eslint-disable-next-line react/jsx-key
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="tags"
                        placeholder="tag"
                      />
                    )}

                  />

                  {(tags.length < 2) && (
                    <p className="text-red-600 text-sm font-light">
                      use at latest two tags
                    </p>
                  )}
                </div>


                <div className='w-full sm:w-auto flex-1 sm:ml-2'>
                  <Autocomplete
                    className='w-full sm:w-auto flex-1 sm:ml-2'
                    value={category}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') setCategory({ name: newValue });
                      else if (newValue && newValue.inputValue) setCategory({ name: newValue.inputValue });
                      else setCategory(newValue);
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      const { inputValue } = params;
                      const isExisting = options.some((option) => inputValue === option.name);
                      if (inputValue !== '' && !isExisting) filtered.push({ inputValue, name: `Add "${inputValue}"` });
                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="free-solo-with-text-demo"
                    options={categoriesOptions}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') return option;
                      if (option.inputValue) return option.inputValue;
                      return option.name;
                    }}
                    renderOption={(props, option) => <li {...props}>{option.name}</li>}
                    sx={{ width: 300 }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField {...params} label="category" />
                    )}
                  />

                  {(!category || category?.name?.length < 2) && (
                    <p className="text-red-600 text-sm font-light">
                      min length of category is 2 characters
                    </p>
                  )}
                </div>

              </Stack>
            </Box>


            <MdEditor
              ref={mdEditorRef}
              style={{ height: '500px' }}
              renderHTML={text => mdParser(text)}
              onChange={handleEditorChange}
              onImageUpload={onImageUpload}
            />
            {(text.length < 100) && (
              <p className="text-red-600 text-sm font-light">
                min length of content is 100 characters
              </p>
            )}
          </Container>
        </>
      )}
    </>
  )
}

export default UpdatePostPage;