import Link from 'next/link';
import Image from 'next/image';
import { IUserProfileProps } from '../../types/profile';
import prisma from '../../libs/prisma';
import { useRouter } from 'next/router';
import Loader from '../../components/Loader';

const Profile = ({ userImage, firstName, lastName, title, about, phoneNumber, country, city, blogName, email }: IUserProfileProps) => {

    const router = useRouter()
    return (
        <div className='max-w-[100vw] h-fit mt-10'>
            {!router.isFallback ? (
                <div className="m-4">
                    <div className=' gap-6 grid-flow-dense grid-cols-10 flex-wrap flex flex-col grid-rows-6 lg:grid'>

                        <div className='flex justify-start h-fit lg:w-full col-span-3 row-span-2 bg-white rounded-md shadow-md p-6'>
                            <div>

                                <Image className='rounded-md' src={userImage} alt="Picture of the author" width={120} height={100} />

                                <h1 className='text-2xl text-gray-800 font-bold'>{firstName + " " + lastName}</h1>
                                {title !== "Not Found" ? (<h2 className='text-gray-600 mt-2'>{title}</h2>) : null}
                            </div>
                        </div>

                        <div className="flex col-span-7 h-fit lg:w-full row-span-4 flex-col justify-center  bg-white rounded-md shadow-md p-6">
                            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>General information</h1>

                            <div className='grid w-full md:grid-cols-2 mt-8 grid-cols-1 gap-4'>

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

                        <div className="flex flex-col lg:w-full h-fit justify-center col-span-3 row-span-2 bg-white rounded-md shadow-md p-6">
                            <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>Blog Information</h1>

                            <h2 className='text-gray-700 text-lg mt-1'>Blog Name: <strong>{blogName}</strong>
                                <hr className='my-2' />
                            </h2>
                            <Link href={`/${blogName}`}>
                                <a className='text-blue-600 hover:text-blue-500 hover:underline text-base'>{blogName}</a>
                            </Link>
                        </div>

                    </div>
                </div>
            ) : (
                <div className="min-w-[100vw] min-h-[100vh] flex text-blue-600 items-center justify-center">
                    <Loader />
                </div>
            )}

        </div>
    )
}

export default Profile;


export async function getStaticPaths() {
    const ids: { params: { id: string } }[] = [];
    const data = await prisma.user.findMany({ select: { id: true } });

    for (let item of data) { 
        ids.push({ params: { id: item.id.toString() } })
     }

    return { paths: ids, fallback: false };
};





export async function getStaticProps({ params }: { params: { id: string } }) {

    let Props: IUserProfileProps = { userImage: "", about: "", blogName: "", country: "", city: "", phoneNumber: "", title: "", firstName: "", lastName: "", email: "" };

    const user = await prisma.user.findUnique({
        where: { id: Number(params.id) },
        select: {
            profile: true,
            firstName: true,
            lastName: true,
            title: true,
            about: true,
            email: true,
            blogName: true,
            phoneNumber: true,
            country: true,
            city: true
        }
    });

    if (!user) return;
    Props = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        blogName: user.blogName,
        userImage: user.profile || "/images/user-placeholder.png",
        phoneNumber: user.phoneNumber?.toString() || "Not Found",
        about: user.about || "Not Found",
        title: user.title || "Not Found",
        country: user.country || "Not Found",
        city: user.city || "Not Found"
    }

    return { props: Props };
}



