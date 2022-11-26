import prisma from '../libs/prisma/index'
import { IUserProfileProps } from '../types/profile';
import { IFeaturedPostProps, IPostProps } from '../types/post';
import moment from 'moment';

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