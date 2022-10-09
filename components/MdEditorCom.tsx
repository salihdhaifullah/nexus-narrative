import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import supabase from '../libs/supabase/config'
import { useEffect, useState, useMemo, useRef } from 'react'
import Swal from 'sweetalert2'
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { createPost, GetTagsAndCategories } from '../api';

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

interface FilmOptionType {
  inputValue?: string;
  title: string;
  year?: number;
}

const filter = createFilterOptions<FilmOptionType>();


const top100Films: readonly FilmOptionType[] = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
  { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { title: 'Forrest Gump', year: 1994 },
  { title: 'Inception', year: 2010 },
  { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: 'Goodfellas', year: 1990 },
  { title: 'The Matrix', year: 1999 },
  { title: 'Seven Samurai', year: 1954 },
  { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { title: 'City of God', year: 2002 },
  { title: 'Se7en', year: 1995 },
  { title: 'The Silence of the Lambs', year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: 'Life Is Beautiful', year: 1997 },
  { title: 'The Usual Suspects', year: 1995 },
  { title: 'Léon: The Professional', year: 1994 },
  { title: 'Spirited Away', year: 2001 },
];

const top100Films2 = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  { label: 'The Lord of the Rings: The Return of the King', year: 2003 },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
  { label: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
  { label: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
  { label: 'Forrest Gump', year: 1994 },
  { label: 'Inception', year: 2010 },
  { label: 'The Lord of the Rings: The Two Towers', year: 2002 },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Seven Samurai', year: 1954 },
  { label: 'Star Wars: Episode IV - A New Hope', year: 1977 },
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
];

const MdEditorCom = () => {
  const mdParser = new MarkdownIt();
  const mdEditorRef: any = useRef();

  const [text, setText] = useState<string>("");
  const [previewsUrl, setPreviewsUrl] = useState<string[]>([]);
  const [data, setData] = useState<Files[]>([])
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<any>()
  const [value, setValue] = useState<FilmOptionType | null>(null);

  const handleEditorChange = ({ html, text }: HandleEditorChangeProps) => {
    setText(text)
  }

  const init = async () => {
    await createPost().then(data => {
      console.log(data);
    })
    await GetTagsAndCategories().then(data => {
      console.log(data)
    })
  }
  
  useEffect(() => {
    init()
  }, [])
  
  useEffect(() => {
    console.log(category);
  }, [category])



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
  //   3- tags = input ✔ & get tags from server ❌
  //   4- slug = input ✔
  //   5- category = input ✔ & get categories from server ❌ 
  //   6- images = dataArray ✔ 


  const HandelSubmit = async () => {
    for (let i = 0; i < data.length; i++) {

      if (text.includes(data[i].previewUrl)) {

        const { data: success, error } = await supabase.storage.from("public").upload(data[i].name, data[i].file)
        if (error) Swal.fire('some think want wrong', 'place check internet connection', 'error')
        else setText(text.replace(previewsUrl[i], data[i].fileUrl));


      }
      URL.revokeObjectURL(previewsUrl[i])
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
      <Container>
        <Box className='px-6 my-2 rounded-md shadow-md bg-white'>
          <Box className="inline-flex w-full">
            <TextField
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              margin="normal"
              required
              fullWidth
              id="title"
              label="title"
              name="title"
              autoFocus
            />

            <TextField
            className="ml-2"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              margin="normal"
              required
              fullWidth
              id="slug"
              label="slug"
              name="slug"
            />
          </Box>

          <Stack className="inline-flex w-full flex-row mb-4">

            <Autocomplete
              className='flex-1 flex'
              multiple
              id="tags-filled"
              options={top100Films.map((option) => option.title)}
              freeSolo
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
              className='ml-2'
              value={value}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') setValue({title: newValue});
                else if (newValue && newValue.inputValue) setValue({title: newValue.inputValue}); 
                else setValue(newValue);  
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                const isExisting = options.some((option) => inputValue === option.title);
                if (inputValue !== '' && !isExisting) filtered.push({inputValue, title: `Add "${inputValue}"`});
                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={top100Films}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option;
                if (option.inputValue) return option.inputValue;
                return option.title;
              }}
              renderOption={(props, option) => <li {...props}>{option.title}</li>}
              sx={{ width: 300 }}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="category" />
              )}
            />
          </Stack>

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