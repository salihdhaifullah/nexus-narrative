import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { MutableRefObject, useEffect, useRef } from "react";
import CircleProgress from "~/components/utils/CircleProgress";
import Post, { IPostProps } from "~/components/utils/Post";
import { prisma } from "~/db.server";
import useInfintieScroll from "~/hooks/useInfintieScroll";

export async function loader({ params, request }: LoaderFunctionArgs) {
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
    const posts = useRef<typeof data.posts>([]);
    const page = useRef(0);

    useEffect(() => {
        posts.current = [...posts.current, ...data.posts]
    }, [data])


    const navigation = useNavigation();
    const navigate = useNavigate();

    useEffect(() => {
        page.current = Number(new URL(window.location.href).searchParams.get("page")) || 0
    }, [])

    const ref = useInfintieScroll(() => navigate(`${window.location.pathname}?page=${page.current+1}`, { replace: true }));

    return (
        <div className='w-full h-fit mb-10'>
            <div>
                {navigation.state === "loading" && !posts.current ? <div className="w-full h-full flex justify-center items-center"> <CircleProgress size="md" /> </div> : (
                    <div className="flex flex-col gap-y-4 justify-center items-center mx-2">
                        {posts.current.length > 0 ? posts.current.map((post, index) => (<div key={index} className="w-full sm:w-[600px]"> <Post post={post as unknown as IPostProps} /> </div>)) : null}
                    </div>
                )}

                {navigation.state === "loading" ? null : <div className="w-full h-[150px] flex justify-center items-center"> <CircleProgress size="md" /> </div>}
                <div ref={ref as MutableRefObject<HTMLDivElement>} className="min-h-[200px] w-full"></div>
            </div>
        </div>
    )
}


export default BlogPosts;
