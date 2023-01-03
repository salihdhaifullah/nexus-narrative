import { IUpdatePostData } from './../../../types/post';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'
import { GetUserIdMiddleware } from '../../../middleware';
import Storage from '../../../libs/supabase';

export const config = {
    api: {
        bodyParser: { sizeLimit: '4mb' }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        try {
            const postId = Number(req.query["id"]);
            if (typeof Number(postId) !== 'number') return res.status(400).json({ massage: "post id Not Find" });

            const data = await prisma.post.findFirst({
                where: { id: postId },
                select: {
                    content: true,
                    category: { select: { name: true } },
                    title: true,
                    tags: { select: { name: true } },
                },
            });

            return res.status(200).json({ data })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }

    if (req.method === "POST") {
        try {
            const storage = new Storage();
            let { title, content, images, tags, category }: IUpdatePostData = req.body;

            if (title.length < 8 || content.length < 100 || category.length < 2 || tags.length < 2) return res.status(400).json({ massage: "unValid data" });


            const postId = Number(req.query["id"]);
            const TagsQuery = []
            const filesNames = []

            const { error, id } = GetUserIdMiddleware(req);

            if (error) return res.status(400).json({ massage: error });

            if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

            if (typeof postId !== 'number') return res.status(400).json({ massage: "Post Not Find" });

            const isFound = await prisma.post.findFirst({
                where: { authorId: id, id: postId },
                select: { images: true, id: true, slug: true, author: { select: { blogName: true } } }
            })


            if (!isFound?.id) return res.status(404).json({ massage: "Not Found Post" });


            for (let image of isFound?.images) {
                if (!content.includes(image)) {
                    await storage.deleteFile(image.split("/public/public/")[1]);
                } else {
                    filesNames.push(image)
                };
            }

            for (let image of images) {
                const { error, Url } = await storage.uploadFile(image.base64)
                if (error) return res.status(500).json({ massage: "Internal Server Error", error: error })
                filesNames.push(Url);
                content = content.replace(image.preViewUrl, Url)
            }


            if (tags && tags.length) {
                for (let tag of tags) {
                    TagsQuery.push({ where: { name: tag }, create: { name: tag } })
                }
            }

            await prisma.post.update({
                where: { id: postId },
                data: {
                    tags: { connectOrCreate: TagsQuery },
                    title: title,
                    content: content,
                    images: filesNames,
                    category: {
                        connectOrCreate: { where: { name: category }, create: { name: category } }
                    }
                }
            });

            return res.status(200).json({ massage: "post Successfully Updated", postUrl: `/${isFound.author.blogName}/posts/${isFound.slug}` });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }
}
