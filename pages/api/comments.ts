import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = Number(req.query["id"]);


        if (typeof id !== "number") return res.status(404).json({massage: "User Not Found"});

        const comments = await prisma.post.findFirst({
            where: { id: id},
            select: {
                comments: {
                    select: {
                        createdAt: true,
                        id: true,
                        content: true,
                        authorId: true,
                        author: { select: { firstName: true, lastName: true, profile: true } }
                    }
                }
            }
        });

        return res.status(200).json({ comments })
    }
}