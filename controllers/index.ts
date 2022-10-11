import prisma from '../libs/prisma/index'
import { GetPostData } from '../api';

interface ISlugItem {
    params: {
        slug: string
    }
}

export const getAllSlugs = async (): Promise<ISlugItem[]> => {
    
    const slugs = []
    const data = await prisma.post.findMany({
        select: {
            slug: true
        }
    })

    for (let item of data) {
        slugs.push({params: item})
    }

    return slugs
}

export const getPostData = async (slug: string) => {
    let dataItem: any = null
    await GetPostData(slug).then((data: any) => dataItem = data.data.dataItem)

    if (!dataItem) throw new Error('data error');


    return {
        slug,
        dataItem,
        content: dataItem.content,
    };
}




