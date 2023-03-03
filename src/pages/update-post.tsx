import Head from 'next/head'
import MdEditor from 'react-markdown-editor-lite';
import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { UpdatePost } from '../api';
import { IUpdatePostData } from '../types/post';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router'
import Toast from '../utils/sweetAlert';
import 'react-markdown-editor-lite/lib/index.css';
import 'highlight.js/styles/github.css';
import mdParser from '../libs/markdown';
import createResizedImage from '../utils/image-resizer';
import prisma from '../libs/prisma';
import { GetUserId } from '../utils/auth';
import { GetServerSidePropsContext } from 'next';



interface IOption {
  name: string
  inputValue?: string
}

interface IImagesData {
  base64: string;
  preViewUrl: string;
}

interface IData {
  category: {
    name: string;
  };
  content: string;
  title: string;
  authorId: number;
  tags: {
    name: string;
  }[];
}

const categoryFilter = createFilterOptions<IOption>();
const tagFilter = createFilterOptions<string>();

const UpdatePostPage = ({ tagsOptions, categoriesOptions, data, postId }: { tagsOptions: IOption[] | null, categoriesOptions: IOption[] | null, data: IData | null, postId: number }) => {
  const router = useRouter()

  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<IOption | null>(null)
  const [images, setImages] = useState<IImagesData[]>([])
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!data) return;
    const tagsData: string[] = [];
    setText(data.content)
    setCategory(data.category)
    for (let tag of data.tags) { tagsData.push(tag.name) }
    setTags(tagsData)
    setTitle(data.title)
  }, [data])

  useEffect(() => {
    if (title.length > 7 && text.length > 99 && (category && category.name.length > 2) && tags.length > 1) {
      setIsValid(true)
    } else setIsValid(false);
  }, [category, tags, text, title])


  const onImageUpload = async (file: File) => {
    const imagesData = images;
    const preViewUrl = URL.createObjectURL(file);
    const base64: string = await createResizedImage(file);

    imagesData.push({ base64, preViewUrl })
    setImages(imagesData);

    return preViewUrl;
  }


  const HandelSubmit = async () => {
    let imagesThatUsed = [];
    if (!isValid) return;

    setIsLoading(true)

    for (let i = 0; i < images.length; i++) {
      if (text.includes(images[i].preViewUrl)) imagesThatUsed.push(images[i]);
      URL.revokeObjectURL(images[i].preViewUrl);
    }

    const data: IUpdatePostData = { title, content: text, images: imagesThatUsed, tags, category: category?.name as string }

    await UpdatePost(postId, data)
      .then((res) => {
        Toast.fire(res.data.massage || 'success post Updated', '', 'success')
        router.push(res.data.postUrl)
      })
      .catch((err) => {
        if (err.response.status === 413) {
          Toast.fire('request is Too Big try to reduce the size of files', '', 'error')
        } else {
          Toast.fire(err.response.data.massage || 'Some Thing Wrong!', '', 'error')
        }
        setIsLoading(false)
      });
  }

  return (
    <>
      <Head>
        <title>Update Post</title>
      </Head>

      <div className={`fixed bottom-[40px] right-[40px] z-10 rounded-full shadow-md
              ${isValid ? "bg-blue-500 hover:bg-blue-600 cursor-pointer" : "bg-gray-400 cursor-not-allowed hover:bg-gray-300"}
              text-white`}>

        <div onClick={() => isLoading ? undefined : HandelSubmit} className='p-2 h-16 w-16 flex items-center justify-center'>
          {isLoading ? <CircularProgress className='text-white h-10 w-10' /> : <p className="text-[16px]">Submit</p>}
        </div>
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
                error={title.length < 8}
                helperText={title.length < 8 ? "min length of title is 8" : undefined}
              />

            </div>

          </Box>

          <Stack className="flex flex-col sm:flex-row w-full flex-wrap mb-4">

            <div className='w-full flex-col sm:w-auto flex-[2] flex mb-2 sm:mb-0'>
              <Autocomplete
                className='w-full sm:w-auto flex-[2] flex mb-2 sm:mb-0'
                multiple
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                filterOptions={(options, params) => {
                  const filtered = tagFilter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((option) => inputValue === option);
                  if (inputValue !== '' && !isExisting) filtered.push(inputValue);
                  return filtered;
                }}
                id="tags"
                options={tagsOptions ? tagsOptions.map((option) => option.name) : []}
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
                    error={tags.length < 2}
                    helperText="you have to insert at least Two tags"
                    {...params}
                    label="tags"
                    placeholder="tag"
                  />
                )}
              />
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
                  const filtered = categoryFilter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some((option) => inputValue === option.name);
                  if (inputValue !== '' && !isExisting) filtered.push({ inputValue, name: `Add "${inputValue}"` });
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={categoriesOptions || []}
                getOptionLabel={(option) => {
                  if (typeof option === 'string') return option;
                  if (option.inputValue) return option.inputValue;
                  return option.name;
                }}
                renderOption={(props, option) => <li {...props}>{option.name}</li>}
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="category"
                    error={!category || category?.name?.length < 2}
                    helperText={!category || category?.name?.length < 2 ? "min length of category is 2 characters" : undefined} />
                )}

              />
            </div>

          </Stack>
        </Box>

        <MdEditor
          value={text}
          style={{ height: '500px' }}
          renderHTML={text => mdParser(text)}
          onChange={({ text }: { text: string }) => setText(text)}
          onImageUpload={onImageUpload}
        />

        {(text.length < 100) && <p className="text-red-600 text-sm font-light"> min length of content is 100 characters </p>}

      </Container>
    </>
  )
}

export default UpdatePostPage;


export async function getServerSideProps(context: GetServerSidePropsContext) {


  const id = Number(context.query["id"])

  if (typeof id !== 'number') return { notFound: true }

  // @ts-ignore
  const { id: userId, error } = GetUserId(context.req)

  if (error || !userId) return { notFound: true }

  const [tagsOptions, categoriesOptions, data] = await prisma.$transaction([
    prisma.tag.findMany({
      select: { name: true }
    }),
    prisma.category.findMany({
      select: { name: true }
    }),
    prisma.post.findUnique({
      where: { id: id },
      select: {
        content: true,
        title: true,
        category: { select: { name: true } },
        tags: { select: { name: true } },
        authorId: true
      }
    })
  ])

  if (!data) return { notFound: true }
  if (data.authorId !== userId) return { notFound: true }


  const props = { tagsOptions, categoriesOptions, data, postId: id }

  return { props }
}
