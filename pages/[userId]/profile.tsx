import React, { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { countries } from '../../static'
import Button from '@mui/material/Button';
import BackupIcon from '@mui/icons-material/Backup';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';

const myLoader = (url: string) => url;

interface ISocial {
  icon: any
  url?: string
  name: string
  color: string
}

let Social: ISocial[] = [
  {
    icon: LinkedInIcon,
    name: "Linkedin account",
    color: "text-[#0072b1]"
  },
  {
    icon: TwitterIcon,
    url: "https:heello.com/llwegweglll",
    name: "Twitter account",
    color: "text-[#00acee]"
  },
  {
    icon: YouTubeIcon,
    url: "https:heeeeello.com/llllewgwel",
    name: "Youtube account",
    color: "text-[#FF0000]"
  },
  {
    icon: FacebookIcon,
    url: "https:heelwegddewglo.com/lllwegwell",
    name: "Facebook account",
    color: "text-[#3b5998]"
  },
  {
    icon: InstagramIcon,
    name: "Instagram account",
    color: "text-[#8a3ab9]"
  },
  {
    icon: GitHubIcon,
    url: "https:heello.com",
    name: "Github account",
    color: "text-[#171515]"
  },
]
const sortByIsUrlNull = (data: ISocial[]) => {
  let sorted = []
  let data1 = []
  let data2 = []

  for (let social of data) {
    if (social.url) data1.push(social);
    else data2.push(social);
  }
  sorted = [...data1, ...data2];
  return sorted
}

Social = sortByIsUrlNull(Social);
const Profile = () => {

  return (
    <div className='max-w-[100vw] min-h-[100vh]'>
      <div className="m-4">

      <h1 className='text-3xl text-gray-800 font-bold mb-4'>User settings</h1>
      <div className=' gap-6 grid-flow-dense grid-cols-10 grid-rows-6 grid'>

        <div className='flex justify-start col-span-3 row-span-2 bg-white rounded-md shadow-md p-6'>
          <div>
            <span className='rounded-md'>
              <Image
                loader={() => myLoader("https://flowbite.com/application-ui/demo/images/users/jese-leos-2x.png")}
                src="me.png"
                alt="Picture of the author"
                width={100}
                height={100}
              />
            </span>

            <h1 className='text-2xl text-gray-800 font-bold'>Jese Leos</h1>
            <h2 className='text-gray-600'>Software Engineer</h2>
            <Button size='small' startIcon={<BackupIcon />} className="text-sm mt-4 lowercase" variant="contained" component="label">
              Change picture
              <input hidden accept="image/*" multiple type="file" />
            </Button>
          </div>
        </div>

        <div className="flex col-span-7 row-span-4 flex-col bg-white rounded-md shadow-md p-6">
          <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>General information</h1>

          <div className='grid grid-cols-1 w-full sm:grid-cols-2 gap-4'>
            {/* about */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            {/* blogName */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            {/* title */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            {/* phoneNumber */}
            <TextField id="outlined-number" label="Number" type="number" variant="outlined" />
            {/* country */}
            <Autocomplete
              id="country-select-demo"
              sx={{ width: 300 }}
              options={countries}
              autoHighlight
              getOptionLabel={(option) => option.label}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <Image
                    loader={() => myLoader(`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`)}
                    width={20}
                    height={15}
                    src={`hello.png`}
                    alt="dssd"
                  />
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose a country"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            {/* city */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            {/* lastName */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            {/* firstName */}

            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            <div></div>
            {/* email */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" type="email" />
          </div>
          <div className="flex w-full items-start">
            <Button size="small" className='w-fit bg-blue-600 text-white' variant='contained'>Save</Button>
          </div>
        </div>

        <div className='flex flex-col col-span-3 row-span-4 bg-white rounded-md shadow-md p-6'>
          <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Social accounts</h1>
          {/* show all Social update and delete */}
          <div className="grid grid-cols-1 gap-3">
            {Social.map((item, index) => (
              <>
                <div key={index} className="flex w-full">
                  <item.icon className={`${item.color} mr-4`} />
                  <div className='mr-4'>
                    <h2 className='text-lg text-start text-gray-800 font-medium'>{item.name}</h2>
                    {item.url ? (
                      <Link href={item.url}>
                        <a className='text-blue-600 hover:text-blue-500 hover:underline'>{item.url.length > 12 ? `${item.url.slice(0, 12)}...` : item.url}</a>
                      </Link>
                    ) : (
                      <h2 className='text-md font-normal text-gray-600'>Not Connected</h2>
                    )}
                  </div>
                  {item.url ? (
                    <Button size="small" className='w-fit h-fit  text-blue-600 bg-white' variant='contained'>Connected</Button>
                  ) : (
                    <Button size="small" className='w-fit h-fit  bg-blue-600 text-white' variant='contained'>Disconnected</Button>
                  )}
                </div>
                <hr />
              </>
            ))}
            <div className="flex w-full items-start">
              <Button size="small" className='w-fit bg-blue-600 text-white' variant='contained'>Save</Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col col-span-7 row-span-2 bg-white rounded-md shadow-md p-6">
          <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Password information</h1>
          {/* to change password */}


          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
            {/* Current password input  */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />

            {/* New password */}
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
          </div>

          <div className="flex w-full items-start mt-4">
            <Button size="small" className='w-fit bg-blue-600 text-white' variant='contained'>Change Password</Button>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}

export default Profile