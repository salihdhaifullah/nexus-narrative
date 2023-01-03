import { IUserProfileProps } from '../../types/profile';
import prisma from '../../libs/prisma';
import Box from '@mui/material/Box'
import Post from '../../components/Post';
import Typography from '@mui/material/Typography';
import { IPostProps } from './../../types/post';
import { useCallback, useEffect, useState } from 'react';
import ProfileTablet from './../../components/ProfileTablet';
import { GetBlogPosts } from '../../api';
import CircularProgress from '@mui/material/CircularProgress';

const Profile = (data: IUserProfileProps) => {

    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState<IPostProps[]>([]);

    const init = useCallback(async () => {
        setIsLoading(true)
        await GetBlogPosts(data.blogName)
            .then((res) => { setPosts(res.data.posts) })
            .catch((err) => { console.log(err) })
        setIsLoading(false)
    }, [data.blogName])

    useEffect(() => {
        init()
    }, [init])

    return (
        <div className='w-full h-fit mb-10'>
            <Box>
                <ProfileTablet {...data} />
                {isLoading ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <div className="flex flex-col gap-y-4 justify-center items-center mx-2">
                        {posts.length < 1
                            ? <Typography className="mb-4 ml-4 underLine w-fit" variant='h5' component='h1'> Sorry No Posts Found </Typography>
                            : posts.map((post, index) => (
                                <div key={index} className="w-full sm:w-[600px]"> <Post post={post} /> </div>
                            ))}
                    </div>
                )}

            </Box>
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

    return { paths: ids, fallback: "blocking" };
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

    return { props: Props, revalidate: 10 };
}
