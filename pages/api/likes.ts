import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const id = Number(req.query["id"]);

        if (typeof id !== "number") return res.status(404).json({massage: "Post Not Found"});
        
        const likes = await prisma.like.count({ where: { isLike: true, postId: id } })
            
        const dislikes = await prisma.like.count({ where: { isDislike: true, postId: id } })

        return res.status(200).json({ likes, dislikes })
    }
}