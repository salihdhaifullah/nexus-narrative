import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Box from '@mui/material/Box'
import { IUserProfileProps } from '../types/profile'

const ProfileTablet = ({ userImage, firstName, lastName, title, about, phoneNumber, country, city, blogName, email }: IUserProfileProps) => {
    return (
        <div className="m-4 mb-[120px]">
            <div className='gap-4 flex-wrap flex flex-col'>

                <Box className="w-full h-full flex gap-6 flex-wrap md:flex-nowrap justify-evenly">
                    <Box className='flex justify-start h-full w-full bg-white rounded-md shadow-md p-6'>
                        <div>

                            <Image className='rounded-md' src={userImage} alt="Picture of the author" width={120} height={100} />

                            <h1 className='text-2xl text-gray-800 font-bold'>{firstName + " " + lastName}</h1>
                            {title !== "Not Found" ? (<h2 className='text-gray-600 mt-2'>{title}</h2>) : null}
                        </div>
                    </Box>

                    <Box className="flex flex-col gap-y-auto w-full h-full justify-start bg-white rounded-md shadow-md p-6">
                        <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Blog Information</h1>

                        <h2 className='text-gray-700 text-lg mt-1'>Blog Name: <strong>{blogName}</strong>
                            <hr className='my-2' />
                        </h2>
                    </Box>
                </Box>

                <div className="flex h-fit w-full flex-col justify-center  bg-white rounded-md shadow-md p-6">
                    <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>General information</h1>

                    <div className='grid w-full grid-cols-1 md:grid-cols-2 mt-8 gap-4'>

                        <h2 className='text-gray-700 text-lg mt-1'>first Name: <strong>{firstName}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>last Name: <strong>{lastName}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>about: <strong>{about}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>title: <strong>{title}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>phone Number: <strong>{phoneNumber}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>country: <strong>{country}
                            <hr className='my-2' />
                        </strong> </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>city: <strong>{city}</strong>
                            <hr className='my-2' />
                        </h2>
                        <h2 className='text-gray-700 text-lg mt-1'>email: <strong>{email}</strong> </h2>

                    </div>
                </div>



            </div>
        </div>
    )
}

export default ProfileTablet
