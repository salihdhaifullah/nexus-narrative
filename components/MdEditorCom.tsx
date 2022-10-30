import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import supabase from '../libs/supabase/config'
import { useEffect, useState, useMemo, useRef, ChangeEvent } from 'react'
import Swal from 'sweetalert2'
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { createPost, GetTagsAndCategories } from '../api';
import { ICreatePostData } from '../types/post';
import { Files } from '../types/file';
import { Button } from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';


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

const filter = createFilterOptions<FilmOptionType>();

const MdEditorCom = () => {
  const mdParser = new MarkdownIt();
  const mdEditorRef: any = useRef();

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

  const handleEditorChange = ({ html, text }: HandleEditorChangeProps) => {
    setText(text)
  }

  const init = async () => {
    await GetTagsAndCategories().then(({data}: any) => {
      if (data.categories.length) {
        setCategoriesOptions(data.categories)
        setTagsOptions(data.tags)
      }
    })
  }
  
  useEffect(() => {
    init()
  }, [])



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


  const handelUploadImage = async (event: ChangeEvent<HTMLInputElement>): Promise<string | undefined> => {
    const file = event.target?.files && event.target.files[0]
    if (!file) return;
    if (file.size > 52428800) Swal.fire('some think want wrong', 'file size is to big', 'error');
    else {

      const name: string = Date.now().toString() + file?.name;

      const fileUrl: string = 'https://nvyulqjjulqfqxirwtdq.supabase.co/storage/v1/object/public/public/' + name;

      const { data: success, error } = await supabase.storage.from("public").upload(name, file)
      if (error) {
        Swal.fire('some think want wrong', 'place check internet connection', 'error');
        return;
      };
      setBackgroundImageUrl(fileUrl)
    }
  }

  const HandelSubmit = async () => {
    if (category && slug && text && title) {
      let replace = text;
      const files = [];
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
          slug,
          images: files,
          tags,
          category: category.name,
          backgroundImageUrl
        }

        await createPost(endData).then((res: any) => {}).catch((err: any) => {})
  
      setTitle("") 
      setSlug("")
      setTags([]) 
      setCategory({name: ""})
      mdEditorRef.current.state.text = ""; // this is the textarea input state from MdEditor component
      mdEditorRef.current.state.html = ""; // this is the textarea input state from MdEditor component
      setText("")
      setPreviewsUrl([])
    }
  }




  return (
    <>
      <div className='fixed top-[540px] right-[40px] z-10 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 text-white'>
        <button className='px-2 py-5 text-[16px]' onClick={HandelSubmit}>
          Submit
        </button>
      </div>
      <Container>
        <Box className='px-6 my-2 py-2 rounded-md shadow-md bg-white'>
          <Box className="flex flex-col sm:flex-row flex-wrap w-full sm:mb-2">
            <TextField
              className='w-full sm:w-auto flex-1 mb-2 sm:mb-0'
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              fullWidth
              id="title"
              label="title"
              name="title"
              autoFocus
            />

            <TextField
            className="w-full flex-1 sm:ml-2 mb-2 sm:mb-0"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              required
              fullWidth
              id="slug"
              label="slug"
              name="slug"
            />
          </Box>

          <Stack className="flex flex-col sm:flex-row w-full flex-wrap mb-4">

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


            <Autocomplete
              className='w-full sm:w-auto flex-1 sm:ml-2'
              value={category}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') setCategory({name: newValue});
                else if (newValue && newValue.inputValue) setCategory({name: newValue.inputValue}); 
                else setCategory(newValue);  
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option.name);
                if (inputValue !== '' && !isExisting) filtered.push({inputValue, name: `Add "${inputValue}"`});
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
          </Stack>
          <Button size='small' startIcon={<BackupIcon />} className="text-sm mt-4 lowercase" variant="contained" component="label">
                Upload background image
                <input onChange={(event) => handelUploadImage(event)} hidden accept="image/*" multiple type="file" />
              </Button>
        </Box>
        <MdEditor
          ref={mdEditorRef}
          style={{ height: '500px' }}
          renderHTML={text => mdParser.render(text)}
          onChange={handleEditorChange}
          onImageUpload={onImageUpload}
        />
      </Container>
    </>
  );
}

export default MdEditorCom;