import { useEffect, useRef } from "react";
import CircleProgress from "@components/utils/CircleProgress";
import Post from "@components/utils/Post";
import useInfintieScroll from "@hooks/useInfintieScroll";
import prisma from "@/utils/prisma";
import { useNavigate, useNavigation } from "react-router-dom";

export async function loader({ params, request }) {
    const { blogName } = params;
    const page = Number(new URL(request.url).searchParams.get("page")) || 0;
    const [posts, count] = await prisma.$transaction([
        prisma.post.findMany({
            where: { author: { blogName: blogName } },
            take: 5,
            skip: page * 5,
            select: {
                backgroundImage: true,
                title: true,
                slug: true,
                createdAt: true,
                likesCount: true,
                dislikesCount: true,
                _count: { select: { comments: true } },
                author: {
                    select: {
                        blogName: true
                    }
                },
                description: true
            }
        }),
        prisma.post.count({ where: { author: { blogName: blogName } } })
    ])

    return json({ posts, count });
}

const BlogPosts = () => {
    const data = useLoaderData<typeof loader>();
    useEffect(() => {
        posts.current = [...posts.current, ...data.posts]
    }, [data])

    const posts = useRef([]);

    const navigation = useNavigation();
    const navigate = useNavigate();
    let page = 0;
    useEffect(() => {
        page = Number(new URL(window.location.href).searchParams.get("page")) || 0
    }, [])
    const ref = useInfintieScroll(() => navigate(`${window.location.pathname}?page=${page+1}`, { replace: true }));

    return (
        <div className='w-full h-fit mb-10'>
            <div>
                {navigation.state === "loading" && !posts.current ? <div className="w-full h-full flex justify-center items-center"> <CircleProgress size="md" /> </div> : (
                    <div className="flex flex-col gap-y-4 justify-center items-center mx-2">
                        {posts.current.length > 0 ? posts.current.map((post, index) => (<div key={index} className="w-full sm:w-[600px]"> <Post post={post} /> </div>)) : null}
                    </div>
                )}

                {navigation.state === "loading" ? null : <div className="w-full h-[150px] flex justify-center items-center"> <CircleProgress size="md" /> </div>}
                <div ref={ref} className="min-h-[200px] w-full"></div>
            </div>
        </div>
    )
}


export default BlogPosts;
