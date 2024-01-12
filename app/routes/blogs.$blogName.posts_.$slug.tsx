import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Details from '~/components/utils/post/Details';
import Main from '~/components/utils/post/Main';
import MainPost from '~/components/utils/post/MainPost';
import Tags from '~/components/utils/post/Tags';
import { prisma } from '~/db.server';

export default function Post() {
    const { post } = useLoaderData<typeof loader>()

    return (
        <article className='w-full block max-w-full p-4 mb-10 mt-4' >
            <MainPost image={post.backgroundImage} title={post.title} />

            <Main
                description={post.description}
                post={post.content}
                createdAt={post.createdAt}
                category={post.category.name}
                authorId={post.author.id}
                blogName={post.author.blogName}
            />

            <Details author={post.author} />
            <Tags tags={post.tags} />
        </article>
    )
}

export async function loader({ params }: LoaderFunctionArgs) {
    const { slug } = params;

    if (!slug) throw new Error("missing slug parma")

    const post = await prisma.post.findFirst({
        where: { slug: slug },
        select: {
            author: {
                select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                    blogName: true,
                    id: true,
                    profile: true,
                    about: true
                }
            },
            id: true,
            content: true,
            title: true,
            description: true,
            tags: { select: { name: true } },
            category: { select: { name: true } },
            createdAt: true,
            backgroundImage: true
        }
    });

    if (!post) throw new Response("not found", { status: 404 });

    return json({ post });
}
