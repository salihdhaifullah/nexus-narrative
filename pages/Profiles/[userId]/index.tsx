import Link from 'next/link';
import Image from 'next/image';
import { IUserProfileProps } from '../../../types/profile';
import { GetUserProfileData } from '../../../controllers';
import CircularProgress from '@mui/material/CircularProgress';
import { getAllUsersIds } from '../../../controllers'

const Profile = (props: IUserProfileProps) => {
  return (
    <div className='max-w-[100vw] min-h-[100vh]'>
      {props ? (
        <div className="m-4">
          <div className=' gap-6 grid-flow-dense grid-cols-10 flex-wrap flex flex-col grid-rows-6 lg:grid'>

            <div className='flex justify-start lg:w-full col-span-3 row-span-2 bg-white rounded-md shadow-md p-6'>
              <div>
                {props.userImage ? (
                  <Image
                    className='rounded-md'
                    src={props.userImage}
                    alt="Picture of the author"
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

                <h1 className='text-2xl text-gray-800 font-bold'>{props.firstName + " " + props.lastName}</h1>
                {props.title && (
                  <h2 className='text-gray-600 mt-2'>{props.title}</h2>
                )}
              </div>
            </div>

            <div className="flex col-span-7 lg:w-full row-span-4 flex-col justify-center  bg-white rounded-md shadow-md p-6">
              <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>General information</h1>

              <div className='grid w-full md:grid-cols-2 mt-8 grid-cols-1 gap-4'>

                <h2 className='text-gray-700 text-lg mt-1'>first Name: <strong>{props.firstName}</strong>
                  <hr className='my-2' />
                </h2>

                <h2 className='text-gray-700 text-lg mt-1'>last Name: <strong>{props.lastName}</strong>
                  <hr className='my-2' />
                </h2>

                <h2 className='text-gray-700 text-lg mt-1'>about: <strong>{props.about || "Not Found"}</strong>
                  <hr className='my-2' />
                </h2>

                <h2 className='text-gray-700 text-lg mt-1'>title: <strong>{props.title || "Not Found"}</strong>
                  <hr className='my-2' />
                </h2>

                <h2 className='text-gray-700 text-lg mt-1'>phone Number: <strong>{props.phoneNumber || "Not Found"}</strong>
                  <hr className='my-2' />
                </h2>

                <h2 className='text-gray-700 text-lg mt-1'>country: <strong>{props.country || "Not Found"}
                  <hr className='my-2' />
                </strong> </h2>

                <h2 className='text-gray-700 text-lg mt-1'>city: <strong>{props.city || "Not Found"}</strong>
                  <hr className='my-2' />
                </h2>
                <h2 className='text-gray-700 text-lg mt-1'>email: <strong>{props.email}</strong> </h2>

              </div>
            </div>

            <div className="flex flex-col lg:w-full justify-center col-span-7 row-span-2 bg-white rounded-md shadow-md p-6">
              <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Blog Information</h1>

              <h2 className='text-gray-700 text-lg mt-1'>Blog Name: <strong>{props.blogName || "Not Found"}</strong>
                <hr className='my-2' />
              </h2>
              {props.blogName && (<Link href={`/${props.blogName}`}>
                <a className='text-blue-600 hover:text-blue-500 hover:underline text-base'>{props.blogName}</a>
              </Link>)}
            </div>

          </div>
        </div>
      ) : (
        <CircularProgress />
      )}

    </div>
  )
}

export default Profile;


export async function getStaticPaths() {
  const paths = await getAllUsersIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  let props = null;
  const data = await GetUserProfileData(params.userId);

  props = data;
  return {
    props: props
  };
}



