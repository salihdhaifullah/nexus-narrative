import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const data = req.query;
        const slug: string | undefined = data.slug;
        if (slug) {
            const dataItem = await prisma.post.findUnique({
                where: {
                    slug: slug
                },
                select: {
                    content: true,
                    images: {
                        select: {
                            fileUrl: true
                        },
                    },
                    title: true,
                    author: {
                        select: {
                            email: true,
                            name: true,
                            Avter: {
                                select: {
                                    fileUrl: true
                                }
                            }
                        },
                    },
                    comments: {
                        select: {
                            createdAt: true,
                            id: true,
                            content: true,
                            authorId: true,
                            author: {
                                select: {
                                    name: true,
                                    Avter: {
                                        select: {
                                            fileUrl: true
                                        },
                                    },
                                },
                            },
                        },
                    },
                    tags: {
                        select: {
                            name: true
                        },
                    },
                    category: {
                        select: {
                            name: true
                        },
                    },
                    createdAt: true,
                    updatedAt: true
                }
            });
        
            return res.status(200).json({dataItem})

        } else return  res.status(400).json({ massage: "slug was not provide" })

    }

    return res.status(200).json({ name: 'John Doe' })
}
