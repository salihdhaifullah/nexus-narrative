import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import supabase from '../libs/supabase/config'
import { useEffect, useState, useMemo, useRef, ChangeEvent, useCallback } from 'react'
import Swal from 'sweetalert2'
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { createPost, GetTagsAndCategories, UpdatePost } from '../api';
import { ICreatePostData } from '../types/post';
import { Files } from '../types/file';
import { Button, CircularProgress } from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';
import { useRouter } from 'next/router'


interface HandleEditorChangeProps {
  html: string
  text: string
}

interface FilmOptionType {
  inputValue?: string;
  name: string;
}

interface IOptions {
  name: string
  inputValue?: string
}

interface IMdEditorProps {
  isUpdate?: boolean;
  postId?: number;
  data?: {
    content: string;
    backgroundImageUrl: string;
    slug: string;
    category: {
      name: string;
    };
    title: string;
    tags: {
      name: string;
    }[];
  }
}

interface IBackgroundImageUrlData {
  file: File;
  name: string;
  fileUrl: string;
}

const filter = createFilterOptions<FilmOptionType>();

const MdEditorCom = (props: IMdEditorProps) => {
  const mdParser = new MarkdownIt();
  const mdEditorRef: any = useRef();
  const Router = useRouter()
  const [backgroundImageUrlData, setBackgroundImageUrlData] = useState<IBackgroundImageUrlData | null>(null)
  const [tagsOptions, setTagsOptions] = useState<IOptions[]>([])
  const [categoriesOptions, setCategoriesOptions] = useState<IOptions[]>([])
  const [text, setText] = useState<string>("");
  const [previewsUrl, setPreviewsUrl] = useState<string[]>([]);
  const [data, setData] = useState<Files[]>([])
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<FilmOptionType | null>(null)
  const [backgroundImageUrl, setBackgroundImageUrl] = useState("")
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEditorChange = ({ html, text }: HandleEditorChangeProps) => {
    setText(text)
  }

  useEffect(() => {
    if (title.length >= 8 && slug.length >= 8 && text.length >= 100 && (category && category?.name?.length >= 2) && tags.length >= 1 && backgroundImageUrl.length > 10) {
      setIsValid(true)
    } else {
      setIsValid(false)
    }
  }, [backgroundImageUrl, category, slug, tags, text, title])


  const init = useCallback(async () => {
    if (props.isUpdate && props.data) {
      console.log(props)
      setTitle(props.data.title)
      setSlug(props.data.slug)
      setCategory(props.data.category)
      setText(props.data.content)
      setBackgroundImageUrl(props.data.backgroundImageUrl)
      mdEditorRef.current.state.text = props.data.content;
      let tags: string[] = []
      for (let tag of props.data.tags) {
        tags.push(tag.name)
      }
      setTags(tags)
    }

    await GetTagsAndCategories().then(({ data }: any) => {
      if (data.categories.length) {
        setCategoriesOptions(data.categories)
        setTagsOptions(data.tags)
      }
    })
  }, [props])
  
  useEffect(() => {
    init()
  }, [init])

  const onImageUpload = async (file: File) => {
    if (file.size > 52428800) Swal.fire('some think want wrong', 'file size is to big', 'error')
    else {
      const previewUrl = URL.createObjectURL(file)
      previewsUrl.push(previewUrl)
      setPreviewsUrl(previewsUrl)

      const name: string = Date.now().toString() + file?.name.replace(/[() ]/g, '').replace("[", "").replace("]", "");

      const fileUrl: string = 'https://nvyulqjjulqfqxirwtdq.supabase.co/storage/v1/object/public/public/' + name;

      const NewObjectFile: Files = { name, fileUrl, file, previewUrl }

      data.push(NewObjectFile)

      setData(data)
      return previewUrl
    }
  }

  const uploadBackgroundImage = async () => {
    if (backgroundImageUrlData) {
      const { data: success, error } = await supabase.storage.from("public").upload(backgroundImageUrlData.name, backgroundImageUrlData.file)
      if (error) {
        Swal.fire('some think want wrong', 'place check internet connection', 'error');
        return;
      };
    }
  }

  const handelUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files && event.target.files[0]
    if (!file) return;
    if (file.size > 52428800) Swal.fire('some think want wrong', 'file size is to big', 'error');
    else {

      const name: string = Date.now().toString() + file?.name.replace(/[() ]/g, '').replace("[", "").replace("]", "");

      const fileUrl: string = 'https://nvyulqjjulqfqxirwtdq.supabase.co/storage/v1/object/public/public/' + name;


      setBackgroundImageUrlData({ file, name, fileUrl })
      setBackgroundImageUrl(fileUrl)
    }
  }

  const HandelSubmit = async () => {

    if (isValid) {
      setIsLoading(true)
      let replace = text;
      const files = [];
      await uploadBackgroundImage()
      for (let i = 0; i < data.length; i++) {

        if (text.includes(data[i].previewUrl)) {

          files.push({ name: data[i].name, fileUrl: data[i].fileUrl });

          const { data: success, error } = await supabase.storage.from("public").upload(data[i].name, data[i].file)
          if (error) return Swal.fire('some think want wrong', 'place check internet connection', 'error');

          replace = replace.replace(data[i].previewUrl, data[i].fileUrl)
        }
        URL.revokeObjectURL(previewsUrl[i])
      }

      const endData: ICreatePostData = {
        title,
        content: replace,
        slug: slug.replace(/[ \/_]/g, '-'),
        images: files,
        tags,
        category: category?.name as string,
        backgroundImageUrl
      }


      if (props.isUpdate) {
        await UpdatePost(Number(props.postId), endData).then((res: any) => { 
          Swal.fire('success', 'post updated', 'success')
          Router.push("/admin")
        }).catch((err: any) => { })
        
      } else {
        await createPost(endData).then((res: any) => {
          Swal.fire('success', 'post created', 'success')
         }).catch((err: any) => { })
      }


      setTitle("")
      setSlug("")
      setBackgroundImageUrl("")
      setTags([])
      setCategory({ name: "" })
      mdEditorRef.current.state.text = ""; // this is the textarea input state from MdEditor component
      mdEditorRef.current.state.html = ""; // this is the textarea input state from MdEditor component
      setText("")
      setPreviewsUrl([])
      setIsLoading(false)
    }
  }




  return (
    <>
      <div className={`fixed top-[540px] right-[40px] z-10 rounded-full shadow-md  
      ${isValid ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : "bg-gray-400 cursor-not-allowed hover:bg-gray-300"} 
      text-white`}>

        {(isLoading) ? (
          <div className='text-white px-2.5 py-1.5 text-[16px]'>
          <CircularProgress  className='text-white '/>
          </div>
        ) : (
          <div className='px-2 py-5 text-[16px]' onClick={HandelSubmit}>
            Submit
          </div>
        )}
      </div>
      <Container>
        <Box className='px-6 my-2 py-2 rounded-md shadow-md bg-white'>
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

            <div className="w-full flex-1 sm:ml-2 mb-2 sm:mb-0">
              <TextField
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                required
                fullWidth
                id="slug"

                label="slug"
                name="slug"
              />
              {(slug.length < 8) && (
                <p className="text-red-600 text-sm font-light">
                  min length of slug is 8
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

              {(tags.length === 0) && (
                <p className="text-red-600 text-sm font-light">
                  tags filled are required
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
          <div className="mt-4">
            <Button size='small' startIcon={<BackupIcon />} className="text-sm lowercase" variant="contained" component="label">
              {backgroundImageUrl ? "uploaded" : "Upload background image"}
              <input onChange={(event) => handelUploadImage(event)} hidden accept="image/*" type="file" />
            </Button>

            {(!backgroundImageUrl) && (
              <p className="text-red-600 text-sm font-light">
                background Image are required
              </p>
            )}
          </div>
        </Box>
        <MdEditor
          ref={mdEditorRef}
          style={{ height: '500px' }}
          renderHTML={text => mdParser.render(text)}
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
  );
}

export default MdEditorCom;