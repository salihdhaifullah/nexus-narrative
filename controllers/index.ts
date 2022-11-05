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
                            backgroundImageUrl: true,
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
                    Avter: {
                        select: {
                            fileUrl: true
                        }
                    },
                    about: true,
                    socil: {
                        select: {
                            name: true,
                            link: true,
                        }
                    }
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
            backgroundImageUrl: true,
            views: true,
        },
    });




    if (data?.id && `${data.views}`) { // i do the validation like this cus view count matey be zero 
        await prisma.post.update({
            where: {
                id: data.id,
            },
            data: {
                views: (Number(data.views) + 1),
            },
        })
    }


    const PostsRelated = await prisma.post.findMany({
        take: 5,
        where: {
            category: {
                name: data?.category.name || " ",
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            backgroundImageUrl: true,
            title: true,
            slug: true,
            createdAt: true,
            author: {
                select: {
                    blogName: true,
                },
            },
        },
    })



    let serializedData: IPostProps = {
        data: null,
    };

    if (data) {
        serializedData = {
            data: {
                content: data.content,
                about: data.author.about || "Not Found",
                socil: data.author.socil,
                email: data.author.email,
                title: data.title,
                blogName: data.author.blogName as string,
                backgroundImageUrl: data.backgroundImageUrl,
                name: data.author.firstName + " " + data.author.lastName,
                AvatarUrl: data.author.Avter?.fileUrl || "/images/user-placeholder.png",
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
    }

    return JSON.parse(JSON.stringify(serializedData.data));
}


interface IBlogName {
    params: {
        blogName: string;
    }
}

export const getAllBlogsName = async (): Promise<IBlogName[]> => {
    const blogName: IBlogName[] = [];

    const data = await prisma.user.findMany({
        select: {
            blogName: true
        }
    })

    for (let item of data) {
        if (typeof item.blogName === "string") {
            blogName.push({ params: { blogName: item.blogName }})
        }
    }
    return blogName;
}



export const getBlogDataForHomePage = async (blogName: string) => {

    const data = await prisma.user.findFirst({
        where: {
            blogName: blogName
        },
        select: {
            about: true,
            socil: {
                select: {
                    name: true,
                    link: true,
                },
            },
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            Avter: {
                select: {
                    fileUrl: true
                }
            },
            posts: {
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    backgroundImageUrl: true,
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


interface IUserIdItem {
    params: {
        userId: string
    }
}

export const getAllUsersIds = async (): Promise<IUserIdItem[]> => {
    const ids: IUserIdItem[] = []
    const data = await prisma.user.findMany({
        select: {
            id: true
        }
    })

    for (let item of data) {
        ids.push({ params: { userId: item.id.toString() } })
    }

    return ids
}





export const GetUserProfileData = async (userId: string): Promise<IUserProfileProps> => {
    let Props: IUserProfileProps = {
        userImage: null, about: null, blogName: null, country: null, city: null,
        phoneNumber: null, title: null, social: null, firstName: "", lastName: "", email: ""
    };

    const user = await prisma.user.findFirst({
        where: {
            id: Number(userId)
        },
        select: {
            Avter: {
                select: {
                    fileUrl: true
                },
            },
            firstName: true,
            lastName: true,
            title: true,
            about: true,
            email: true,
            blogName: true,
            phoneNumber: true,
            country: true,
            city: true,
            socil: {
                select: {
                    name: true,
                    link: true
                },
            },
        },
    })

    if (user) {
        Props = {
            about: user.about,
            userImage: user.Avter?.fileUrl || "/images/user-placeholder.png",
            phoneNumber: `${user.phoneNumber}` || null,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            title: user.title,
            social: user.socil,
            blogName: user.blogName as string,
            country: user.country,
            city: user.city
        }
    }




    return Props;
}