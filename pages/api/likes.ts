import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = Number(req.query["id"]);

        if (typeof id !== "number") return res.status(404).json({massage: "Post Not Found"});
        
        const likes = await prisma.post.findUnique({ where: { id: id }, select: { likes: true, dislikes: true } })
        return res.status(200).json({ likes })
    }
}