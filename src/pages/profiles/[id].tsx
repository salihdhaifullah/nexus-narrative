import prisma from '../../libs/prisma';
import Box from '@mui/material/Box'
import Post from '../../components/utils/Post';
import { IPostProps } from './../../types/post';
import { useCallback, useEffect, useState, useRef } from 'react';
import ProfileTemplate from '../../components/utils/ProfileTemplate';
import CircularProgress from '@mui/material/CircularProgress';
import { getProfilePosts } from '../../api';
import { GetServerSidePropsContext } from 'next';

interface IProfile {
    user: {
        profile: string | null;
        firstName: string;
        lastName: string;
        title: string | null;
        about: string | null;
        email: string;
        blogName: string;
        phoneNumber: number | null;
        country: string | null;
        city: string | null;
        _count: { posts: number };
    };
    profileId: number
}

const Profile = (props: IProfile) => {

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingRow, setIsLoadingRow] = useState(false)
    const [posts, setPosts] = useState<IPostProps[]>([]);
    const [page, setPage] = useState(0)

    const handelLoadPosts = async (init?: boolean) => {
        init ? setIsLoading(true) : setIsLoadingRow(true)
        await getProfilePosts(props.profileId, page)
            .then((res) => {
                setPosts((prev) => [...prev, ...res.data.posts])
                setPage((prev) => (prev + 1))
            })
            .catch((err) => { console.log(err) })
            .finally(() => { init ? setIsLoading(false) : setIsLoadingRow(false) })
    }

    useEffect(() => { handelLoadPosts(true) }, [])

    const [state, setState] = useState(false)
    const [ele, setEle] = useState<Element | null>(null)
    const observer = useRef<IntersectionObserver | null>(null)

    const eleCallBack = useCallback((node: HTMLDivElement) => { setEle(node) }, [])

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => { setState(entries[0].isIntersecting) })
    }, [])

    useEffect(() => { if (ele) observer.current?.observe(ele) }, [ele])

    useEffect(() => {
        if (posts.length !== props.user._count.posts && !isLoadingRow && state) handelLoadPosts();
    }, [state])

    return (
        <div className='w-full h-fit mb-10'>
            <Box>
                <ProfileTemplate data={props.user} />

                {isLoading ? <div className="w-full h-full flex justify-center items-center"> <CircularProgress /> </div> : (
                    <div className="flex flex-col gap-y-4 justify-center items-center mx-2">
                        {posts.length > 0 ? posts.map((post, index) => (<div key={index} className="w-full sm:w-[600px]"> <Post post={post} /> </div>)) : null}
                    </div>
                )}

                {!isLoadingRow ? null : <div className="w-full h-[150px] flex justify-center items-center"> <CircularProgress className="w-12 h-12"/> </div>}
                <div ref={eleCallBack} className="min-h-[200px] w-full "></div>
            </Box>
        </div>
    )
}

export default Profile;


export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const profileId = (ctx.params ? Number(ctx.params['id']) : undefined)

    if (typeof profileId !== 'number') return { notFound: true }

    const user = await prisma.user.findUnique({
        where: { id: profileId },
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
            city: true,
            _count: { select: { posts: true } }
        }
    });

    const props = { user, profileId }

    return { props }
}
