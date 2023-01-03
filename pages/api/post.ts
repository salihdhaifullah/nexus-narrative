import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { ICreatePostData, SortByType } from '../../types/post'
import { GetUserIdMiddleware } from '../../middleware';
import Storage from '../../libs/supabase'

export const config = {
    api: { bodyParser: { sizeLimit: '4mb' } }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        try {
            const category = req.query["category"];

            const filterQuery = typeof category === "string" ? { where: { category: { name: category } } } : null;

            if (req.query["length"]) {
                let length;

                if (!filterQuery) length = await prisma.post.count()
                else length = await prisma.post.count(filterQuery)

                return res.status(200).json({ length })
            }

            const skip = Number(req.query["skip"]);
            const take = Number(req.query["take"]);
            const sort: SortByType | any = req.query["sort"];

            if (!["Likes", "Views", "CreateAt"].includes(sort)) return res.status(404).json({ massage: "Sort unValid" })

            let orderBy: { likes: { _count: "desc"; }; } | { views: { _count: "desc"; }; } | { createdAt: "desc" } = { createdAt: "desc" };

            switch (sort) {
                case "Likes": orderBy = { likes: { _count: "desc" } }
                    break;
                case "Views": orderBy = { views: { _count: "desc" } }
                    break;
                case "CreateAt": orderBy = { createdAt: "desc" }
                default: orderBy = { createdAt: "desc" }
            }

            if (typeof skip !== "number") return res.status(404).json({ massage: "skip is not a number" });
            if (typeof take !== "number") return res.status(404).json({ massage: "take is not a number" });

            let posts;
            if (filterQuery) {
                posts = await prisma.post.findMany({

                    orderBy: orderBy,
                    where: filterQuery.where,
                    skip: skip,
                    take: take,
                    select: {
                        author: { select: { blogName: true } },
                        backgroundImage: true,
                        title: true,
                        slug: true,
                        createdAt: true,
                        description: true
                    }
                });
            } else {
                posts = await prisma.post.findMany({
                    orderBy: orderBy,
                    skip: skip,
                    take: take,
                    select: {
                        author: { select: { blogName: true } },
                        backgroundImage: true,
                        title: true,
                        slug: true,
                        createdAt: true,
                        description: true
                    }
                });
            }


            return res.status(200).json({ posts });
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

            const { error, id } = GetUserIdMiddleware(req)

            if (error) return res.status(400).json({ massage: error });

            if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

            const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true, blogName: true } });

            if (!user) return res.status(400).json({ massage: "User Not Found" });

            const isSlugUnique = await prisma.post.findUnique({ where: { slug: slug }, select: { id: true } });

            if (isSlugUnique?.id) return res.status(400).json({ massage: "slug is already taken" })

            if (tags && tags.length) for (let tag of tags) { TagsQuery.push({ where: { name: tag }, create: { name: tag } }) };

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
                    category: { connectOrCreate: { where: { name: category }, create: { name: category } } },
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

            if (typeof Number(postId) !== 'number') return res.status(400).json({ massage: "postId Not Valid" })

            const { error, id } = GetUserIdMiddleware(req)
            if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });
            if (error) return res.status(400).json({ massage: error });

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

            await prisma.post.delete({ where: { id: Number(postId) } });

            return res.status(200).json({ massage: "post Successfully Deleted" });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }
}
