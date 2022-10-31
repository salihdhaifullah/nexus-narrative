import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const blogName = req.query["blogName"];

        if (typeof blogName !== "string") return res.status(400).json({ error: "Invalid blog name" });

        const data = await prisma.user.findFirst({
            where: {
                blogName: blogName
            },
            select: {
                about: true,
                socil: {
                    select: {
                        name: true,
                        link: true,
                    },
                },
                email: true,
                firstName: true,
                lastName: true,
                Avter: {
                    select: {
                        fileUrl: true
                    }
                },
            }
        })

        const posts = await prisma.post.findMany({
            where: {
                author: {
                    blogName: blogName,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                backgroundImageUrl: true,
                title: true,
                slug: true,
                createdAt: true,
            }
        })

       return res.status(200).json({ data, posts })
    }
  
  
    res.status(200).json({ name: 'John Doe' })
}