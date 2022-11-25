import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { ICreatePostData } from '../../types/post'
import { GetUserIdMiddleware } from '../../middleware';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const tags = await prisma.tag.findMany({ select: { name: true } });
        const categories = await prisma.category.findMany({ select: { name: true } });
        res.status(200).json({ tags, categories })
    }


    if (req.method === "POST") {
        const TagsQuery = []
        let { title, description, content, slug, images, tags, category, backgroundImage }: ICreatePostData = req.body;
        const filesNames: string[] = [];
        
        if (!title || !content || !slug || !category || !description) return res.status(400).json({ massage: "Bad Request" });

        if (title.length < 8 || description.length < 20 || slug.length < 8 || content.length < 100 || category.length < 1 || tags.length < 2 || !backgroundImage) {
            return res.status(400).json({ massage: "unValid data" });
        }

        const isValidSlug: boolean = new RegExp("^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$").test(slug)

        if (!isValidSlug) return res.status(400).json({ massage: "Bad Request slug is unValid" })

        const { error, id } = GetUserIdMiddleware(req)

        if (error) return res.status(400).json({ massage: error });

        if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

        const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true } });

        if (!user) return res.status(400).json({ massage: "User Not Found" });

        const isSlugUnique = await prisma.post.findUnique({ where: { slug: slug }, select: { id: true } });

        if (isSlugUnique?.id) return res.status(400).json({ massage: "slug is already taken" })

        if (tags && tags.length) for (let tag of tags) { TagsQuery.push({ where: { name: tag }, create: { name: tag } }) };

        for (let image of images) {
            const fileContents = image.base64.replace(/^data:image\/png;base64,/, "");
            const name = Date.now().toString() + image.fileName;
            filesNames.push(name);
            const fileName = `./public/uploads/${name}`;
            content = content.replace(image.preViewUrl, `/uploads/${name}`)

            fs.writeFile(fileName, fileContents, 'base64', function (err: any) { console.log(err) });
        }


        const fileContents = backgroundImage.base64.replace(/^data:image\/png;base64,/, "");
        const backgroundImageName = Date.now().toString() + backgroundImage.fileName;
        const fileName = `./public/uploads/${backgroundImageName}`

        fs.writeFile(fileName, fileContents, 'base64', function (err: any) { console.log(err) });


        await prisma.post.create({
            data: {
                backgroundImage: backgroundImageName,
                tags: { connectOrCreate: TagsQuery },
                title: title,
                content: content,
                images: filesNames || [],
                category: { connectOrCreate: { where: { name: category }, create: {name: category } } },
                slug: slug,
                author: { connect: { id: id } },
                description: description 
            }
        });

        return res.status(200).json({ massage: "post Successfully Created" });

    }

    if (req.method === 'DELETE') {
        const postId = req.query["id"]

        if (typeof Number(postId) !== 'number') return res.status(400).json({ massage: "postId Not Valid" })

        const { error, id } = GetUserIdMiddleware(req)
        if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });
        if (error) return res.status(400).json({ massage: error });

        const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true, posts: { where: { id: Number(postId) }, select: { id: true } } } });

        if (!user?.posts[0].id) return res.status(400).json({ massage: "User Not Found" })

        await prisma.post.delete({ where: { id: Number(postId) } });

        return res.status(200).json({ massage: "post Successfully Deleted" });

    }
}
