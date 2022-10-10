import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import prisma from '../../libs/prisma'
import { ICreatePostData } from '../../types/post'
import { GetUserIdMiddleware } from '../../middleware';



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
        const { title, content, slug, images, tags, category }: ICreatePostData = req.body

        const data = await prisma.post.create({
            data: {
                tags: {
                    connectOrCreate: [{
                        where: {
                            name: "tags",
                        },
                        create: {
                            name: "tags"
                        }
                    }],
                    // connectOrCreate: tags,
                },
                title: title,
                content: content,
                images: {
                    create: images
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
                    connect: { id: "3c747b75-460d-4fae-aeac-93f243f33a20" },
                },
            },
            include: {
                tags: true,
                category: true,
                author: true
            },
        })

        return res.status(200).json({ massage: "Get the Fuck" });
    } else return res.status(404).json({ massage: `this method ${req.method} is not allowed` });
}
