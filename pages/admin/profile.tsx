import React, { ChangeEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { countries, ISocial, Social } from '../../static'
import Button from '@mui/material/Button';
import BackupIcon from '@mui/icons-material/Backup';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import { ChangeBlogName, ChangePassword, CreateSocial, GetProfileData, UpdateProfileGeneralInformation, uploadAvatar } from '../../api';
import userPlaceholder from "../../public/images/user-profile.jpg";
import { IUserProfileData, ISocil, IUpdateProfileGeneralInformation, IUploadAvatar } from '../../types/profile'
import DialogInputs from '../../components/DialogInputs';
import { SocilTypes } from '@prisma/client';
import supabase from '../../libs/supabase/config';
import Swal from 'sweetalert2';

const myLoader = (url: string) => url;

const sortByIsUrlNull = (data: ISocial[], links: ISocil[]): ISocial[] => {
  let sorted: ISocial[] = []
  if (links.length) {
    let data1: ISocial[] = []
    let data2: ISocial[] = []

    for (let socil of data) {
      const item = links.find((item) => item.name === socil.name.split(" ")[0])
      if (item) data1.push({ color: socil.color, name: socil.name, url: item.link, icon: socil.icon })
      else data2.push({ color: socil.color, name: socil.name, icon: socil.icon })
    }
    sorted = [...data1, ...data2];

  } else sorted = data;
  return sorted
}

const Profile = () => {
  const [userImage, setUserImage] = useState("")
  const [about, setAbout] = useState("")
  const [blogName, setBlogName] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [phoneNumber, setPhoneNumber] = useState<string>("")
  const [title, setTitle] = useState("")
  const [socil, setSocil] = useState<ISocil[]>([])
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [socialToCreate, setSocialToCreate] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")
  const [socialName, setSocialName] = useState("")
  const [openDialogInputs, setOpenDialogInputs] = useState(false)
  const [countryDefault, setCountryDefault] = useState<any>(null)
  const [social, setSocial] = useState<ISocial[]>([])
  let profile: IUserProfileData | null = null;


  const init = async () => {
    await GetProfileData().then((data) => {
      console.log(data.data.user)
      profile = data.data.user
      if (profile) {
        if (profile.Avter) setUserImage(profile.Avter.fileUrl);
        if (profile.about) setAbout(profile.about);
        if (profile.blogName) setBlogName(profile.blogName);
        if (profile.country) setCountry(profile.country);
        if (profile.city) setCity(profile.city);
        if (profile.phoneNumber) setPhoneNumber(profile.phoneNumber.toString());
        if (profile.title) setTitle(profile.title);
        if (profile.socil) setSocil(profile.socil);
        setFirstName(profile.firstName);
        setLastName(profile.lastName)
        setEmail(profile.email)
        setCountryDefault(countries.find((item) => item.label === country))
        setSocial(sortByIsUrlNull(Social, socil));
      }
    });
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    setSocial(sortByIsUrlNull(Social, socil));
  }, [socil])

  const HandelUpdateProfileGeneralInformation = async () => {
    let phoneNumber1: number | undefined = undefined;
    if (phoneNumber && typeof Number(phoneNumber) === "number") phoneNumber1 = Number(phoneNumber);

    const data: IUpdateProfileGeneralInformation = {
      country,
      city,
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber1,
      title,
      about,
    }
    await UpdateProfileGeneralInformation(data).then((data: any) => {
      console.log(data.data.massage);
    }).catch((err: any) => {
      console.log(err);
    })
  }

  const handelConnected = (SocialName: string) => {
    setOpenDialogInputs(true);
    setSocialName(SocialName)
  }

  const handelCreateSocil = async (data: ISocil): Promise<void> => {
    setOpenDialogInputs(false);
    console.log(data);
    await CreateSocial(data).then((data: any) => {
      console.log(data)
    }).catch((err: any) => {
      console.log(err)
    })
  }

  const handelChangeBlogName = async () => {
    if (blogName) {
      await ChangeBlogName({ blogName: blogName }).then((data: any) => {
        console.log(data)
      }).catch((err: any) => {
        console.log(err)
      })
    }
  }

  const HandelChangePassword = async () => {
    if (currentPassword && newPassword) {
      await ChangePassword({ currentPassword, newPassword }).then((data) => {
        console.log(data)
      }).catch((err: any) => {
        console.log(err)
      })
    }
  }

  const handelUploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files && event.target.files[0]
    if (!file) return;
    if (file.size > 52428800) Swal.fire('some think want wrong', 'file size is to big', 'error');

    else {
      setPreviewUrl(URL.createObjectURL(file))

      const name: string = Date.now().toString() + file?.name;

      const fileUrl: string = 'https://nvyulqjjulqfqxirwtdq.supabase.co/storage/v1/object/public/public/' + name;

      const NewObjectFile: IUploadAvatar = { name, fileUrl };

      const { data: success, error } = await supabase.storage.from("public").upload(NewObjectFile.name, file)
      if (error) return Swal.fire('some think want wrong', 'place check internet connection', 'error');
      await uploadAvatar(NewObjectFile).then((data) => {
        console.log(data)
      }).catch((err: any) => {
        console.log(err)
      })
    }
  }

  return (
    <div className='max-w-[100vw] min-h-[100vh]'>
      <DialogInputs
        open={openDialogInputs}
        setOpen={setOpenDialogInputs}
        setValue={setSocial}
        value={social}
        name={socialName as SocilTypes}
        handel={handelCreateSocil}
      />
      <div className="m-4">

        <h1 className='text-3xl text-gray-800 font-bold mb-4'>User settings</h1>
        <div className=' gap-6 grid-flow-dense grid-cols-10 flex-wrap flex flex-col grid-rows-6 lg:grid'>

          <div className='flex justify-start lg:w-full col-span-3 row-span-2 bg-white rounded-md shadow-md p-6'>
            <div>
                {previewUrl || userImage ? (
                  <Image
                    className='rounded-md'
                    loader={() => myLoader(previewUrl || userImage)}
                    src={"me.png"}
                    alt="Picture of the author"
                    width={120}
                    height={100}
                  />
                ) : (
                  <Image
                    className='rounded-md'
                    src={userPlaceholder}
                    alt="user-placeholder"
                    width={120}
                    height={100}
                  />
                )}

              <h1 className='text-2xl text-gray-800 font-bold'>{firstName + " " + lastName}</h1>
              {title && (
                <h2 className='text-gray-600'>{title}</h2>
              )}
              <Button size='small' startIcon={<BackupIcon />} className="text-sm mt-4 lowercase" variant="contained" component="label">
                {userImage ? "Change picture" : "Upload picture"}
                <input onChange={(event) => handelUploadAvatar(event)} hidden accept="image/*" multiple type="file" />
              </Button>
            </div>
          </div>

          <div className="flex col-span-7 lg:w-full row-span-4 flex-col justify-center  bg-white rounded-md shadow-md p-6">
            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>General information</h1>

            <div className='grid w-full md:grid-cols-2 grid-cols-1 gap-4'>

              <TextField value={firstName} onChange={(event) => setFirstName(event.target.value)} id="First Name" name="First Name" label="First Name" variant="outlined" />

              <TextField value={lastName} onChange={(event) => setLastName(event.target.value)} id="Last Name" name="Last Name" label="Last Name" variant="outlined" />

              <TextField value={about} onChange={(event) => setAbout(event.target.value)} id="About" name="About" label="About" variant="outlined" />

              <TextField value={title} onChange={(event) => setTitle(event.target.value)} id="Title" name="Title" label="Title" variant="outlined" />

              <TextField value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} id="Phone Number" name="Phone Number" label="Phone Number" variant="outlined" />

              <Autocomplete
                id="Country"
                options={countries}
                autoHighlight
                defaultValue={null}
                value={countryDefault || null}
                getOptionLabel={(option) => option.label}
                onChange={(event, value: any) => {
                  setCountryDefault(value)
                  if (value?.label) setCountry(value.label);
                }}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Image
                      loader={() => myLoader(`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`)}
                      width={20}
                      height={15}
                      src={`country.png`}
                      alt=""
                    />
                    {option.label} ({option.code}) +{option.phone}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: 'new-password', // disable autocomplete and autofill
                    }}
                  />
                )}
              />
              <TextField value={city} onChange={(event) => setCity(event.target.value)} id="City" name="City" label="City" variant="outlined" />

              <TextField value={email} onChange={(event) => setEmail(event.target.value)} id="Email" name="Email" label="Email" variant="outlined" type="email" />
            </div>
            <div className="flex w-full items-start">
              <Button onClick={HandelUpdateProfileGeneralInformation} size="small" className='w-fit mt-2 bg-blue-600 text-white' variant='contained'>Save</Button>
            </div>
          </div>

          <div className='flex flex-col lg:w-full col-span-3 row-span-4 bg-white rounded-md shadow-md p-6'>
            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Social accounts</h1>
            {/* show all Social update and delete */}
            <div className="grid grid-cols-1 gap-3">
              {social.map((item, index) => (
                <div key={index}>
                  <div className="flex w-full mt-2 justify-evenly">
                    <div className="flex w-full">
                      <item.icon className={`${item.color && item.color + " "} mr-4`} />
                      <div className='mr-4'>
                        <h2 className='text-lg text-start text-gray-800 font-medium'>{item.name}</h2>
                        {item.url ? (
                          <Link href={item.url}>
                            <a className='text-blue-600 hover:text-blue-500 hover:underline'>{item.url.length > 20 ? `${item.url.slice(0, 20)}...` : item.url}</a>
                          </Link>
                        ) : (
                          <h2 className='text-md font-normal text-gray-600'>Not Connected</h2>
                        )}
                      </div>
                    </div>
                    {item.url ? (
                      <Button onClick={() => handelConnected(item.name.split(" ")[0])} className='flex lowercase text-sm px-4 h-fit text-blue-600 bg-white' variant='contained'>Connected</Button>
                    ) : (
                      <Button onClick={() => handelConnected(item.name.split(" ")[0])} className='flex lowercase text-sm px-4 h-fit bg-blue-600 text-white' variant='contained'>Disconnected</Button>
                    )}
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:w-full col-span-7 justify-center row-span-2 bg-white rounded-md shadow-md p-6">
            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Password information</h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
              <TextField id="Current password" name="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} label="Current password" variant="outlined" />

              <TextField id="New password" name="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} label="New password" variant="outlined" />
            </div>

            <div className="flex w-full items-start mt-4">
              <Button onClick={HandelChangePassword} size="small" className='w-fit bg-blue-600 text-white' variant='contained'>Change Password</Button>
            </div>
          </div>

          <div className="flex flex-col lg:w-full col-span-7 row-span-2 bg-white rounded-md shadow-md p-6">
            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Blog Name</h1>

            <TextField value={blogName} onChange={(event) => setBlogName(event.target.value)} id="Blog Name" name="Blog Name" label="Blog Name" variant="outlined" />

            <div className="flex w-full items-start mt-4">
              <Button onClick={handelChangeBlogName} size="small" className='w-fit bg-blue-600 text-white' variant='contained'>save</Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile