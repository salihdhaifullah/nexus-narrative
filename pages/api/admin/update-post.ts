import fs from 'fs';
import { IUpdatePostData } from './../../../types/post';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'
import { GetUserIdMiddleware } from '../../../middleware';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

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
    }

    if (req.method === "POST") {

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
            select: { images: true, id: true, slug: true, author: { select: { blogName: true }  }}
        })

        
        if (!isFound?.id) return res.status(404).json({ massage: "Not Found Post" });


        await fs.mkdirSync("./public/uploads", { recursive: true });

        for (let image of isFound?.images) {
            if (!content.includes(`/uploads/${image}`)) {
                await fs.access(`./public/uploads/${image}`, fs.constants.R_OK, async (err) => {
                    if (err) return;
                    await fs.unlinkSync(`./public/uploads/${image}`)
                });
            };
        }

        for (let image of images) {
            const fileContents = image.base64.split(',')[1];
            const name = Date.now().toString() + image.fileName;
            filesNames.push(name);
            const fileName = `./public/uploads/${name}`;
            content = content.replace(image.preViewUrl, `/uploads/${name}`)


            await fs.access(fileName, fs.constants.R_OK, async (err) => {
                if (err) await fs.writeFile(fileName, fileContents, 'base64', (err: any) => {  });
            });

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
    }
}
