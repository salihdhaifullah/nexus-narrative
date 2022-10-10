import prisma from '../libs/prisma/index'
import matter from 'gray-matter';
import { GetPostData } from '../api';
import { remark } from 'remark';
import html from 'remark-html';

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

    const matterResult = matter(dataItem.content);

    const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

    console.log(contentHtml)
    return {
        slug,
        dataItem,
        contentHtml,
        ...matterResult.data,
    };
}




