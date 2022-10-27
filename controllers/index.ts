import prisma from '../libs/prisma/index'
import { GetPostData, GetProfileData } from '../api';
import { ISocil, IUserProfileProps } from '../types/profile';
import { ISocial, Social } from '../static';

interface ISlugItem {
    params: {
        slug: string
        blogName: string
    }
}

interface IBlogName {
    params: {
        blogName: string
    }
}

export const getAllBlogsName = async (): Promise<IBlogName[] | any> => {
    const blogName = [];

    const data = await prisma.user.findMany({
        where: {
            NOT: [
                {
                    blogName: null,
                },
            ],
        },
        select: {
            blogName: true
        }
    })

    for (let item of data) {
        blogName.push({ params: item })
    }
    return blogName;
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

export const getPostData = async (slug: string) => {
    let dataItem: any = null
    await GetPostData(slug).then((data: any) => dataItem = data.data.dataItem)
    console.log(dataItem)
    return {
        slug,
        dataItem: dataItem,
        content: dataItem.content,
    };
}

export const getBlogData = async (blogName: string) => {
    const dataItem = {};
    return {
        blogName,
        dataItem,
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


    await GetProfileData(userId).then((data) => {
        const profile = data.data.user
        if (profile) {
            if (profile.Avter) Props.userImage = profile.Avter.fileUrl;
            if (profile.about) Props.about = profile.about;
            if (profile.blogName) Props.blogName = profile.blogName;
            if (profile.country) Props.country = profile.country;
            if (profile.city) Props.city = profile.city;
            if (profile.phoneNumber) Props.phoneNumber = profile.phoneNumber.toString();
            if (profile.title) Props.title = profile.title;
            if (profile.socil) Props.social = profile.socil;
            Props.firstName = profile.firstName;
            Props.lastName = profile.lastName;
            Props.email = profile.email;
        }
    });
    return Props;
}