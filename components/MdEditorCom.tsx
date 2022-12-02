import MdEditor from 'react-markdown-editor-lite';
import { useEffect, useState, useRef, ChangeEvent, useCallback } from 'react'
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { createPost, GetTagsAndCategories, UpdatePost } from '../api';
import { ICreatePostData } from '../types/post';
import { Button, CircularProgress } from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';
import { useRouter } from 'next/router'
import Toast from '../functions/sweetAlert';
import toBase64 from '../functions/toBase64';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import mdParser from '../libs/markdown';


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

interface IFileData {
  base64: string;
}

interface IImagesData {
  base64: string;
  preViewUrl: string;
}

const filter = createFilterOptions<FilmOptionType>();

const MdEditorCom = () => {
  const mdEditorRef: any = useRef();
  const router = useRouter()

  const [tagsOptions, setTagsOptions] = useState<IOptions[]>([])
  const [categoriesOptions, setCategoriesOptions] = useState<IOptions[]>([])


  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<FilmOptionType | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<IFileData | null>(null)
  const [images, setImages] = useState<IImagesData[]>([])
  const [isValidSlug, setIsValidSlug] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEditorChange = ({ html, text }: HandleEditorChangeProps) => setText(text);

  useEffect(() => {
    if (backgroundImage && title.length >= 8 && slug.length >= 8 && text.length >= 100 && (category && category.name.length >= 2) && tags.length >= 1) {
      setIsValid(true)
    } else setIsValid(false);
  }, [backgroundImage, category, slug, tags, text, title])


  useEffect(() => {
    const test = new RegExp("^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$").test(slug)
    setIsValidSlug(test)
  }, [slug])

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
    const base64: string = await toBase64(file);

    imagesData.push({ base64, preViewUrl })
    setImages(imagesData);

    return preViewUrl;
  }

  const handelUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files && event.target.files[0];
    if (!file) return;

    const base64: string = await toBase64(file) as string;

    setBackgroundImage({ base64 });
  }


  const HandelSubmit = async () => {
    let imagesThatUsed = [];
    if (!isValid) return;
    if (!backgroundImage || !category?.name) return;

    setIsLoading(true)

    for (let i = 0; i < images.length; i++) {
      if (text.includes(images[i].preViewUrl)) imagesThatUsed.push(images[i]);

      URL.revokeObjectURL(images[i].preViewUrl);
    }

    const data: ICreatePostData = { title, content: text, slug, images: imagesThatUsed, tags, category: category.name, backgroundImage, description }

    await createPost(data)
      .then((res) => {
        Toast.fire(res.data.massage || 'success post created', '', 'success')
        router.push(res.data.postUrl)

        setTitle("")
        setSlug("")
        setDescription("")
        setBackgroundImage(null)
        setTags([])
        setCategory({ name: "" })
        mdEditorRef.current.state.text = ""; // this is the textarea input state from MdEditor component
        mdEditorRef.current.state.html = ""; // this is the textarea input state from MdEditor component
        setText("")
        imagesThatUsed = []
      })
      .catch((err) => {
        if (err.response.status === 413) {
          Toast.fire('request is Too Big try to reduce the size of files', '', 'error')
        } else {
          Toast.fire(err.response.data.massage || 'Some Thing Wrong!', '', 'error')
        }
      })


    setIsLoading(false)
  }



  return (
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
              {(slug.length < 8) ? (
                <p className="text-red-600 text-sm font-light">
                  min length of slug is 8
                </p>
              ) : (!isValidSlug) && (
                <p className="text-red-600 text-sm font-light">
                  unValid slug, use only numbers and letters with dash as space
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

          <div className="flex  min-w-full">
            <TextField
              className="w-full flex-1 my-2"
              error={description.length < 20}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              id="description"
              helperText={description.length < 20 && "min length is 20 characters"}
              label="description"
              name="description"
            />
          </div>

          <div className="mt-4">
            <Button size='small' startIcon={<BackupIcon />} className="text-sm lowercase" variant="contained" component="label">
              {backgroundImage ? "uploaded" : "Upload background image"}
              <input onChange={(event) => handelUploadImage(event)} hidden accept="image/*" type="file" />
            </Button>

            {(!backgroundImage) && (
              <p className="text-red-600 text-sm font-light">
                background Image are required
              </p>
            )}
          </div>


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
  );
}

export default MdEditorCom;