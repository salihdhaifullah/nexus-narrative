import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { ICreatePostData, IUpdatePostData, SortByType } from '../../types/post'
import { GetUserId } from '../../utils/auth';
import Storage from '../../libs/supabase'
import { Prisma } from '@prisma/client';

export const config = {
    api: { bodyParser: { sizeLimit: '4mb' } }
}

const filterQuery = (search: unknown, tag: unknown, category: unknown) => {
    let query: Prisma.PostWhereInput = {}

    if (typeof search === 'string' && search.length > 0) query["OR"] = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
    ];

    if (typeof tag === 'string' && tag.length > 1) query["tags"] = { some: { name: tag } };

    if (typeof category === 'string' && category.length > 1) query["category"] = { name: category };

    return query;
}

const SortQuery = (sort: unknown) => {
    let query: Prisma.PostOrderByWithRelationInput = {}
    const sortOptions = ["likes", "views", "date"]

    if (typeof sort !== "string" || sort.length < 1 || !sortOptions.includes(sort)) return query;

    if (sort === "likes") query = { likesCount: "desc" }
    else if (sort === "views") query = { views: { _count: "desc" } }
    else query = { createdAt: "desc" }

    return query;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        try {
            const category = req.query["category"];
            const tag = req.query["tag"];
            const search = req.query["search"];
            const sort = req.query["sort"];

            const page = Number(req.query["page"]);

            if (typeof page !== "number") return res.status(400).json({ massage: "page is not a number" });

            console.log(filterQuery(search, tag, category))

            const [posts, count] = await prisma.$transaction([
                prisma.post.findMany({
                    orderBy: SortQuery(sort),
                    where: filterQuery(search, tag, category),
                    skip: (page * 5),
                    take: 5,
                    select: {
                        author: { select: { blogName: true } },
                        backgroundImage: true,
                        title: true,
                        slug: true,
                        createdAt: true,
                        description: true
                    }
                }),
                prisma.post.count({ where: filterQuery(search, tag, category) })
            ])

            return res.status(200).json({ posts, count });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

    if (req.method === 'PATCH') {
        try {
            const storage = new Storage();
            let { title, content, images, tags, category }: IUpdatePostData = req.body;

            if (title.length < 8 || content.length < 100 || category.length < 2 || tags.length < 2) return res.status(400).json({ massage: "unValid data" });

            const postId = Number(req.query["id"]);
            const TagsQuery = []
            const filesNames = []

            const { error, id } = GetUserId(req);

            if (typeof id !== "number" || error) return res.status(400).json({ massage: "User Not Found" });

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
                    TagsQuery.push({ where: { name: tag.trim() }, create: { name: tag.trim() } })
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
                        connectOrCreate: { where: { name: category.trim() }, create: { name: category.trim() } }
                    }
                }
            });

            return res.status(200).json({ massage: "post Successfully Updated", postUrl: `/${isFound.author.blogName}/posts/${isFound.slug}` });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

    if (req.method === "POST") {

        try {

            const TagsQuery = []
            const storage = new Storage();
            let { title, description, content, slug, images, tags, category, backgroundImage }: ICreatePostData = req.body;
            const filesNames: string[] = [];

            if (!title || !content || !slug || !category || !description) return res.status(400).json({ massage: "Bad Request" });

            if (title.length < 8 || description.length < 20 || slug.length < 8 || content.length < 100 || category.length < 1 || tags.length < 2 || !backgroundImage) {
                return res.status(400).json({ massage: "unValid data" });
            }


            const isValidSlug: boolean = new RegExp("^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$").test(slug)

            if (!isValidSlug) return res.status(400).json({ massage: "Bad Request slug is unValid" })

            const { error, id } = GetUserId(req)

            if (typeof id !== "number" || error) return res.status(400).json({ massage: "User Not Found" });

            const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true, blogName: true } });

            if (!user) return res.status(400).json({ massage: "User Not Found" });

            const isSlugUnique = await prisma.post.findUnique({ where: { slug: slug }, select: { id: true } });

            if (isSlugUnique?.id) return res.status(400).json({ massage: "slug is already taken" })

            if (tags && tags.length) for (let tag of tags) { TagsQuery.push({ where: { name: tag.trim() }, create: { name: tag.trim() } }) };

            for (let image of images) {
                const { error, Url } = await storage.uploadFile(image.base64)

                if (error) return res.status(500).json({ massage: "Internal Server Error", error: error })
                filesNames.push(Url);

                content = content.replace(image.preViewUrl, Url)
            }


            const { error: StorageError, Url: backgroundImageName } = await storage.uploadFile(backgroundImage.base64)
            if (StorageError) return res.status(500).json({ massage: "Internal Server Error", error: error })


            await prisma.post.create({
                data: {
                    backgroundImage: backgroundImageName,
                    tags: { connectOrCreate: TagsQuery },
                    title: title,
                    content: content,
                    images: filesNames || [],
                    category: { connectOrCreate: { where: { name: category.trim() }, create: { name: category.trim() } } },
                    slug: slug,
                    author: { connect: { id: id } },
                    description: description
                }
            });

            return res.status(200).json({ massage: "post Successfully Created", postUrl: `/${user.blogName}/posts/${slug}` });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }

    if (req.method === 'DELETE') {

        try {
            const postId = Number(req.query["id"])
            const storage = new Storage();

            if (typeof postId !== 'number') return res.status(400).json({ massage: "postId Not Valid" })

            const { error, id } = GetUserId(req)
            if (typeof id !== "number" || error) return res.status(400).json({ massage: "User Not Found" });

            const post = await prisma.post.findUnique({
                where: { id: postId },
                select: { id: true, backgroundImage: true, images: true, authorId: true }
            });

            if (!post?.id) return res.status(400).json({ massage: "Post Not Found" })
            if (post.authorId !== id) return res.status(403).json({ massage: "UnAuthorized To Delete This Post" });

            await storage.deleteFile(post.backgroundImage.split("/public/public/")[1]);

            for (let image of post.images) {
                await storage.deleteFile(image.split("/public/public/")[1]);
            }

            await prisma.post.delete({ where: { id: postId } });

            return res.status(200).json({ massage: "post Successfully Deleted" });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }
}
