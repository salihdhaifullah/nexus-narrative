import prisma from '../libs/prisma/index'
import { IUserProfileProps } from '../types/profile';
import { IFeaturedPostProps, IPostProps } from '../types/post';
import moment from 'moment';

interface ISlugItem {
    params: {
        slug: string
        blogName: string
    }
}


export const getAllSlugs = async (): Promise<ISlugItem[] | any> => {

    const slugs = []
    const data = await prisma.post.findMany({
        select: {
            slug: true,
            author: {
                select: {
                    blogName: true,
                },
            },
        }
    })

    for (let item of data) {
        slugs.push({ params: { slug: item.slug, blogName: item.author.blogName } })
    }

    return slugs;
}


// TODO

export const getPostData = async (slug: string): Promise<IPostProps> => {

    const data = await prisma.post.findFirst({
        where: {
            slug: slug
        },
        select: {
            id: true,
            content: true,
            title: true,
            author: {

                select: {
                    posts: {
                        take: 5,
                        orderBy: {
                            createdAt: "desc",
                        },
                        select: {
                            backgroundImage: true,
                            title: true,
                            slug: true,
                            createdAt: true,
                            author: {
                                select: {
                                    blogName: true,
                                },
                            },
                        },
                    },
                    email: true,
                    firstName: true,
                    lastName: true,
                    blogName: true,
                    id: true,
                    profile: true,
                    about: true
                },
            },
            tags: {
                select: {
                    name: true
                },
            },
            category: {
                select: {
                    name: true
                },
            },
            createdAt: true,
            backgroundImage: true,
            views: true,
        },
    });


    const PostsRelated = await prisma.post.findMany({
        take: 5,
        where: { category: { name: data?.category.name || " " } },
        orderBy: { createdAt: "desc" },
        select: {
            backgroundImage: true,
            title: true,
            slug: true,
            createdAt: true,
            author: { select: { blogName: true } }
        },
    });



    let serializedData: IPostProps = { data: null };

    if (!data) return;
    serializedData = {
        data: {
            content: data.content,
            about: data.author.about || "Not Found",
            email: data.author.email,
            title: data.title,
            blogName: data.author.blogName as string,
            backgroundImage: data.backgroundImage,
            name: data.author.firstName + " " + data.author.lastName,
            AvatarUrl: data.author.profile || "/images/user-placeholder.png",
            createdAt: moment(data.createdAt).format("ll"),
            tags: data.tags,
            category: data.category.name,
            postId: data.id,
            slug: slug,
            posts: data.author.posts as IFeaturedPostProps[],
            PostsRelated: PostsRelated as IFeaturedPostProps[],
            authorId: data.author.id,
        }
    }

    return JSON.parse(JSON.stringify(serializedData.data));
}



export const getAllBlogsName = async (): Promise<{params: { blogName: string; }}[]> => {
    const blogsNames: {params: { blogName: string; }}[] = [];

    const data = await prisma.user.findMany({ select: { blogName: true } })

    for (let item of data) {
        if (!item.blogName) return;
        blogsNames.push({ params: { blogName: item.blogName } });
    }

    return blogsNames;
}

export const getBlogDataForHomePage = async (blogName: string) => {

    const data = await prisma.user.findFirst({
        where: { blogName: blogName },
        select: {
            about: true,
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profile: true,
            posts: {
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    backgroundImage: true,
                    title: true,
                    slug: true,
                    createdAt: true,
                    author: {
                        select: {
                            blogName: true,
                        },
                    },
                },
            }
        }
    });

    return {
        data: JSON.parse(JSON.stringify(data)),
    };
}