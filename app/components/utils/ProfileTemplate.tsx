interface IProfileProps {
    avatarUrl: string;
    firstName: string;
    lastName: string;
    title: string | null;
    about: string | null;
    email: string;
    blog: string;
    phoneNumber: number | null;
    country: string | null;
    city: string | null;
    _count: { posts: number };
}

const ProfileTemplate = ({ data }: { data: IProfileProps }) => {
    return (
        <div className="m-4 mb-[120px]">
            <div className='gap-4 flex-wrap flex flex-col'>

                <div className="w-full h-full flex justify-center items-center">
                    <div className='flex justify-center items-center flex-col gap-8 h-full rounded-lg w-full max-w-[500px] bg-white shadow-md p-6'>

                        <div className="bg-white w-[150px] h-[150px] p-4 rounded-full shadow-lg border">
                            <img className='object-center' src={data.avatarUrl} alt="author" width={120} height={100} />
                        </div>

                        <h1 className='text-2xl text-gray-800 font-bold'>{data.firstName + " " + data.lastName}</h1>
                        {data.title ? <h2 className='text-gray-600 mt-2'>{data.title}</h2> : null}
                    </div>
                </div>

                <div className="flex h-fit w-full flex-col justify-center  bg-white rounded-md shadow-md p-6">
                    <h1 className='text-xl text-start text-gray-800 font-bold mb-4'>General information</h1>

                    <div className='grid w-full grid-cols-1 md:grid-cols-2 mt-8 gap-4'>

                        <h2 className='text-gray-700 text-lg mt-1'>first Name: <strong>{data.firstName}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>last Name: <strong>{data.lastName}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>Blog Name: <strong>{data.blog}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>about: <strong>{data.about || "Not Found"}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>title: <strong>{data.title || "Not Found"}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>phone Number: <strong>{data.phoneNumber || "Not Found"}</strong>
                            <hr className='my-2' />
                        </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>country: <strong>{data.country || "Not Found"}
                            <hr className='my-2' />
                        </strong> </h2>

                        <h2 className='text-gray-700 text-lg mt-1'>city: <strong>{data.city || "Not Found"}</strong>
                            <hr className='my-2' />
                        </h2>
                        <h2 className='text-gray-700 text-lg mt-1'>email: <strong>{data.email}</strong> </h2>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default ProfileTemplate;
