import useMarkdown from '@/components/utils/markdown/useMarkdown';
import useFetchApi from '@/hooks/useFetchApi';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface IUserProfile {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  bio: string;
  profileMarkdown: string;
}

export const meta = () => {
  return [
    // { title: data?.data?.blog },
    // { name: "description", content: data?.data?.bio }
  ]
}

const Profile = () => {
  const {blogName} = useParams()

  const [payload, call] = useFetchApi<IUserProfile>("GET", `user/${blogName}`);
  const jsx = useMarkdown(payload.result?.profileMarkdown || "");

  useEffect(() => {
    call()
  }, [call])

  return (
    <div className='w-full h-fit mb-10'>
      <div>
        {payload.result ? (
          <div className="m-4 mb-[120px]">
            <div className='gap-4 flex-wrap flex flex-col'>

              <div className="w-full h-full flex justify-center items-center">
                <div className='flex justify-center items-center flex-col gap-8 h-full rounded-lg w-full max-w-[500px] bg-white shadow-md p-6'>

                  <div className="bg-white w-[150px] h-[150px] p-4 rounded-full shadow-lg border">
                    <img className='object-center' src={payload.result.avatarUrl} alt="author" width={120} height={100} />
                  </div>

                  <h1 className='text-2xl text-gray-800 font-bold'>{payload.result.firstName + " " + payload.result.lastName}</h1>
                  {payload.result.bio ? <h2 className='text-gray-600 mt-2'>{payload.result.bio}</h2> : null}
                </div>
              </div>

              <div className="flex h-fit w-full flex-col justify-center  bg-white rounded-md shadow-md p-6">
                <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>General information</h1>

                <div className='grid w-full grid-cols-1 md:grid-cols-2 mt-8 gap-4'>

                  <h2 className='text-gray-700 text-lg mt-1'>first Name: <strong>{payload.result.firstName}</strong>
                    <hr className='my-2' />
                  </h2>

                  <h2 className='text-gray-700 text-lg mt-1'>last Name: <strong>{payload.result.lastName}</strong>
                    <hr className='my-2' />
                  </h2>

                  <h2 className='text-gray-700 text-lg mt-1'>Blog Name: <strong>{blogName}</strong>
                    <hr className='my-2' />
                  </h2>

                </div>
              </div>


              <div className='bg-normal rounded-md shadow-md p-4 my-10 flex flex-col'>
                  {jsx}
              </div>

            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Profile;
