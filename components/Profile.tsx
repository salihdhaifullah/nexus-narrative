import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import BackupIcon from '@mui/icons-material/Backup';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress'

import { ChangeBlogName, ChangePassword, GetProfileData, UpdateProfileGeneralInformation, uploadProfileImage } from '../api';
import { IUserProfileData, IUpdateProfileGeneralInformation, IUploadAvatar } from '../types/profile'
import { countries } from '../static';
import Toast from '../functions/sweetAlert';
import toBase64 from '../functions/toBase64';


const Profile = () => {
  const [userImage, setUserImage] = useState("")
  const [about, setAbout] = useState("")
  const [blogName, setBlogName] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [title, setTitle] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [countryDefault, setCountryDefault] = useState<any>(null)
  const [isValidBlogName, setIsValidBlogName] = useState(false)


  const [isLoadingInfo, setIsLoadingInfo] = useState(false)
  const [isLoadingBlogName, setIsLoadingBlogName] = useState(false)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)

  const init = useCallback(async () => {
    await GetProfileData().then((data) => {
      const profile: IUserProfileData | null = data.data.user;
      if (!profile) return;

      setUserImage(profile.profile || "");
      setAbout(profile.about || "");
      setBlogName(profile.blogName || "");
      setCountry(profile.country || "");
      setCity(profile.city || "");
      setPhoneNumber(profile.phoneNumber?.toString() || "");
      setTitle(profile.title || "");

      setFirstName(profile.firstName);
      setLastName(profile.lastName)
      setEmail(profile.email)

      setCountryDefault(countries.find((item) => item.label === country))
    });
  }, []);

  useEffect(() => {
    setCountryDefault(countries.find((item) => item.label === country))
  }, [country])

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    const test = new RegExp("^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$").test(blogName)
    setIsValidBlogName(test)
  }, [blogName])

  const HandelUpdateProfileGeneralInformation = async () => {
    if (!lastName.length || !firstName.length || !email.length) return Toast.fire("firstName, lastName, Email are required", "", 'error');
    setIsLoadingInfo(true)


    const data: IUpdateProfileGeneralInformation = { country, city, firstName, lastName, email, phoneNumber: Number(phoneNumber) || null, title, about };

    await UpdateProfileGeneralInformation(data)
      .then((res) => { Toast.fire(res.data.message, "", 'success') })
      .catch((err) => { Toast.fire(err.response.data.massage, "", 'error') });
    init()
    setIsLoadingInfo(false)
  }


  const handelChangeBlogName = async () => {
    setIsLoadingBlogName(true)
    if (!blogName) return;
    await ChangeBlogName({ blogName: blogName })
      .then((res) => {
        Toast.fire(res.data.massage, "", 'success')
      })
      .catch((err) => {
        Toast.fire(err.response.data.massage, "", 'error')
      });
    init()
    setIsLoadingBlogName(false)
  }

  const HandelChangePassword = async () => {

    Swal.fire({ title: "Do You want to change your password ?", icon: "warning", showConfirmButton: true, showCancelButton: true })
      .then(async (res) => {
        if (!res.value) return;

        if (!currentPassword || !newPassword) return Toast.fire("current password, new password are required", "", "error");
        setIsLoadingPassword(true)

        await ChangePassword({ currentPassword, newPassword })
          .then((res) => { Toast.fire(res.data.massage, "", 'success') })
          .catch((err) => { Toast.fire(err.response.data.massage, "", 'error') });

        init();
        setIsLoadingPassword(false)
      });
  }

  const handelUploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files ? event.target.files[0] : null;

    if (!file) return Toast.fire("No File Selected", "", 'warning');

    setIsLoadingAvatar(true);

    const base64 = await toBase64(file, 160, 120)

    const data: IUploadAvatar = { base64 }

    await uploadProfileImage(data)
      .then((res) => {
        setUserImage(res.data.name)
        Toast.fire(res.data.massage, "", 'success')
      })
      .catch((err) => {
        if (err.response.status === 413) {
          Toast.fire('file is Too Big try to reduce the size of files', '', 'error')
        } else {
          Toast.fire(err.response.data.massage || 'Some Thing Wrong!', '', 'error')
        }
      });

    setIsLoadingAvatar(false)
  }

  return (
    <div className='max-w-[100vw] min-h-[100vh]'>
      <div className="m-4">

        <h1 className='text-3xl text-gray-800 font-bold mb-4'>Settings</h1>
        <div className=' gap-6 grid-flow-dense grid-cols-10 flex-wrap flex flex-col grid-rows-6 lg:grid'>

          <div className='flex justify-start h-fit lg:w-full col-span-3 row-span-2 bg-white rounded-md shadow-md p-6'>
            <div>
              {userImage ? (
                <Image
                  className='rounded-md'
                  src={userImage}
                  alt="user-image"
                  width={120}
                  height={100}
                />
              ) : (
                <Image
                  className='rounded-md'
                  src="/images/user-placeholder.png"
                  alt="user-placeholder"
                  width={120}
                  height={100}
                />
              )}

              <h1 className='text-2xl text-gray-800 font-bold'>{firstName + " " + lastName}</h1>
              {title && (<h2 className='text-gray-600'>{title}</h2>)}

              <Button size='small' disabled={isLoadingAvatar} startIcon={<BackupIcon />} className="text-sm mt-4 lowercase" variant="contained" component="label">
                {isLoadingAvatar ? (<CircularProgress className='text-white w-5 h-5 ' />)
                  : userImage ? "Change picture" : "Upload picture"}
                <input onChange={(event) => handelUploadAvatar(event)} hidden accept="image/*" type="file" />
              </Button>

            </div>
          </div>


          <div className="flex col-span-7 lg:w-full row-span-4 flex-col justify-center  bg-white rounded-md shadow-md h-fit p-6">
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
                      width={20}
                      height={15}
                      src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                      alt="flag"
                    />
                    {option.label} ({option.code}) +{option.phone}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    inputProps={{ ...params.inputProps }}
                  />
                )}
              />

              <TextField value={city} onChange={(event) => setCity(event.target.value)} id="City" name="City" label="City" variant="outlined" />

              <TextField value={email} onChange={(event) => setEmail(event.target.value)} id="Email" name="Email" label="Email" variant="outlined" type="email" />
            </div>

            <div className="flex w-full items-start">
              <Button onClick={HandelUpdateProfileGeneralInformation}
                size="small" disabled={isLoadingInfo} className='w-fit mt-2 bg-blue-600 text-white' variant='contained'>
                {isLoadingInfo ? (<CircularProgress className='text-white w-5 h-5' />) : "Save"}
              </Button>
            </div>

          </div>

          <div className="flex flex-col h-fit lg:w-full col-span-3 row-span-2 bg-white rounded-md shadow-md p-6">
            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Blog Name</h1>

            <TextField value={blogName} onChange={(event) => setBlogName(event.target.value)} id="Blog Name" name="Blog Name" label="Blog Name" variant="outlined" />

            <div className="flex w-full items-start mt-4">
              <Button onClick={handelChangeBlogName} disabled={isLoadingBlogName || !isValidBlogName} size="small" className='w-fit bg-blue-600 text-white' variant='contained'>
                {isLoadingBlogName ? (<CircularProgress className='text-white  w-5 h-5' />) : "Save"}
              </Button>
              {isValidBlogName ? null : (
                <p className="text-red-600 text-center text-sm font-light">
                  unValid blog Name, use only numbers and letters with dash as space
                </p>
              )}
            </div>

          </div>

          <div className="flex flex-col h-fit lg:w-full col-span-7 justify-center row-span-2 bg-white rounded-md shadow-md p-6">
            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Password information</h1>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
              <TextField id="Current password" name="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} label="Current password" variant="outlined" />

              <TextField id="New password" name="New password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} label="New password" variant="outlined" />
            </div>

            <div className="flex w-full items-start mt-4">
              <Button onClick={HandelChangePassword} disabled={isLoadingPassword} size="small" className='w-fit bg-blue-600 text-white' variant='contained'>
                {isLoadingPassword ? (<CircularProgress className='text-white  w-5 h-5' />) : "Change Password"}
              </Button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile;
