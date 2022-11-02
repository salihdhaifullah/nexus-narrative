import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { ICreatePostData } from '../../types/post'
import { GetUserIdMiddleware } from '../../middleware';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {

        const tags = await prisma.tag.findMany({
            select: {
                name: true
            }
        })
        const categories = await prisma.category.findMany({
            select: {
                name: true
            }
        })
        res.status(200).json({ tags, categories })

    } 
    
    
    if (req.method === "POST") {
        const TagsQuery = []

        const { error, id } = GetUserIdMiddleware(req)

        if (error) return res.status(400).json({ massage: error });

        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
            select: {
                id: true
            }
        });

        if (!user) return res.status(400).json({ massage: "User Not Found" })

        const { title, content, slug, images, tags, category, backgroundImageUrl }: ICreatePostData = req.body

        if (!title || !content || !slug || !category) return res.status(400).json({ massage: "Bad Request" })

        const isSlugUnique = await prisma.post.findUnique({
            where: {
                slug: slug
            },
            select: {
                id: true
            }
        })

        if (isSlugUnique?.id) return res.status(400).json({ massage: "Bad Request slug is not unique" })

        if (tags && tags.length) {
            for (let tag of tags) {
                TagsQuery.push({
                    where: {
                        name: tag
                    },
                    create: {
                        name: tag
                    }
                })
            }
        }

        const data = await prisma.post.create({
            data: {
                backgroundImageUrl: backgroundImageUrl,
                tags: {
                    connectOrCreate: TagsQuery,
                },
                title: title,
                content: content,
                images: {
                    create: images || []
                },
                category: {
                    connectOrCreate: {
                        where: {
                            name: category
                        },
                        create: {
                            name: category
                        }
                    },
                },
                slug: slug,
                author: {
                    connect: { id: id },
                },
            },
            include: {
                tags: true,
                category: true,
                author: true
            },
        })

        return res.status(200).json({ massage: "post Successfully Created", data: data });

    }  
    
    if (req.method === 'DELETE') {
        const postId = req.query["id"]

        if (typeof Number(postId) !== 'number') return res.status(400).json({ massage: "postId Not Valid" })

        const { error, id } = GetUserIdMiddleware(req)

        if (error) return res.status(400).json({ massage: error });

        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                posts: {
                    where: {
                        id: Number(postId),
                    },
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!user?.posts[0].id) return res.status(400).json({ massage: "User Not Found" })

        await prisma.post.delete({
            where: {
                id: Number(postId)
            },
        });

        return res.status(200).json({ massage: "post Successfully Deleted" });

    } 
    
    
    
    
    
    
    res.status(404).json({ massage: `this method ${req.method} is not allowed` });
}
