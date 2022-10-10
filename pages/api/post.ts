import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import prisma from '../../libs/prisma'
import { ICreatePostData } from '../../types/post'
import { GetUserIdMiddleware, GetUserRoleAndIdMiddleware } from '../../middleware';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const { error, id } = GetUserIdMiddleware(req)

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

    } else if (req.method === "POST") {
        const TagsQuery = []
        
        const { error, id, role } = GetUserRoleAndIdMiddleware(req)
        
        if (error) return res.status(400).json({massage: error});

        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
            select: {
                role: true
            }
        });

        if (!user) return res.status(400).json({massage: "User Not Found"})
        if (user.role !== "ADMIN") return res.status(403).json({massage: "UnAuthorized"})
        

        const { title, content, slug, images, tags, category }: ICreatePostData = req.body

        if (!title || !content || !slug || !category) return res.status(400).json({massage: "Bad Request"})

        const isSlugUnique = await prisma.post.findUnique({
            where: {
                slug: slug
            },
            select: {
                id: true
            }
        })

        if (isSlugUnique?.id) return res.status(400).json({massage: "Bad Request slug is not unique"})

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
    } else return res.status(404).json({ massage: `this method ${req.method} is not allowed` });
}
