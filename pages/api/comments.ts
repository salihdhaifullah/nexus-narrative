import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const slug = req.query["slug"] as string;

        const comments = await prisma.post.findFirst({
            where: {
                slug: slug,
            },
            select: {
                comments: {
                    select: {
                        createdAt: true,
                        id: true,
                        content: true,
                        authorId: true,
                        author: {
                            select: {
                                firstName: true,
                                lastName: true,
                                Avter: {
                                    select: {
                                        fileUrl: true
                                    },
                                }
                            },
                        },
                    },
                },
            }
        })

        return res.status(200).json({ comments })
    }
}