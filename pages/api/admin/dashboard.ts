import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'
import { GetUserIdMiddleware } from '../../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        try {
            const { error, id } = GetUserIdMiddleware(req);
            if (error) return res.status(400).json({ massage: error });
            if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

            const data = await prisma.views.groupBy({
                by: ["monthAndYear"],
                where: { post: { authorId: id } },
                _count: true
            })

            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

}
