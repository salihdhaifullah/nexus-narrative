import Link from 'next/link';
import Image from 'next/image';
import userPlaceholder from "../../../public/images/user-profile.jpg";
import { ISocil, IUserProfileProps } from '../../../types/profile';
import { getAllUsersIds, GetUserProfileData } from '../../../controllers';
import { ISocial, Social } from '../../../static';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useEffect, useState } from 'react';

const myLoader = (url: string) => url;

const RemoveSocialWithOutLink = (data: ISocial[], links: ISocil[]): ISocial[] => {
  let sorted: ISocial[] = []
  if (links.length) {
    let data1: ISocial[] = []

    for (let socil of data) {
      const item = links.find((item) => item.name === socil.name.split(" ")[0])
      if (item) data1.push({ color: socil.color, name: socil.name, url: item.link, icon: socil.icon })
    }
    sorted = data1;

  } else sorted = data;
  return sorted
}


const Profile = (props: IUserProfileProps) => {
  const [social, setSocial] = useState<ISocial[]>([])

  useEffect(() => {
    if (props?.social) {
      setSocial(RemoveSocialWithOutLink(Social, props.social))
    }
  }, [props.social])

  return (
    <div className='max-w-[100vw] min-h-[100vh]'>
      <div className="m-4">
        <div className=' gap-6 grid-flow-dense grid-cols-10 flex-wrap flex flex-col grid-rows-6 lg:grid'>

          <div className='flex justify-start lg:w-full col-span-3 row-span-2 bg-white rounded-md shadow-md p-6'>
            <div>
              {props.userImage ? (
                <Image
                  className='rounded-md'
                  loader={() => myLoader(props.userImage as string)}
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

          <div className='flex flex-col lg:w-full  col-span-3 row-span-4 bg-white rounded-md shadow-md p-6'>
            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Social accounts</h1>
            <div className="grid grid-cols-1 gap-3">
              {social && social.map((item, index) => (
                <div key={index}>
                  <div className="flex w-full mt-2 justify-evenly">
                    <div className="flex w-full">
                      {item.name.split(" ")[0] === "Linkedin" && (
                        <LinkedInIcon className="mr-4 text-[#0072b1]" />
                      ) || item.name.split(" ")[0] === "Twitter" && (
                        <TwitterIcon className="mr-4 text-[#00acee]" />
                      ) || item.name.split(" ")[0] === "Youtube" && (
                        <YouTubeIcon className="mr-4 text-[#FF0000]" />
                      ) || item.name.split(" ")[0] === "Facebook" && (
                        <FacebookIcon className="mr-4 text-[#3b5998] " />
                      ) || item.name.split(" ")[0] === "Instagram" && (
                        <InstagramIcon className="mr-4 text-[#8a3ab9] " />
                      ) || item.name.split(" ")[0] === "Github" && (
                        <GitHubIcon className="mr-4 text-[#171515]" />
                      )}
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
                  </div>
                  <hr />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:w-full justify-center col-span-7 row-span-2 bg-white rounded-md shadow-md p-6">
            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Blog Information</h1>

            <h2 className='text-gray-700 text-lg mt-1'>Blog Name: <strong>{props.blogName || "Not Found"}</strong>
              <hr className='my-2' />
            </h2>
            {props.blogName && (<Link href={props.blogName}>
              <a className='text-blue-600 hover:text-blue-500 hover:underline text-base'>{props.blogName}</a>
            </Link>)}
          </div>

        </div>
      </div>
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
  const data = await GetUserProfileData(params.userId);
  return {
    props: data
  };
}