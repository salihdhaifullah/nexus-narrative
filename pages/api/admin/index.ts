import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'
import { GetUserIdMiddleware } from '../../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        const { error, id } = GetUserIdMiddleware(req);
        if (error) return res.status(400).json({ massage: error });
        if (id === undefined) return res.status(400).json({ massage: "Bad Request" });

        const data = await prisma.user.findFirst({
            where: {
                id: id,
            },
            select: {
                posts: {
                    select: {
                        slug: true,
                        views: true,
                        title: true,
                        id: true,
                    }
                },
                blogName: true,
            },
        });

        return res.status(200).json({data})
    } 
    
    
    res.status(200).json({massage: 'hello world'})
}