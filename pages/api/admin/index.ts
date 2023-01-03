import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'
import { GetUserIdMiddleware } from '../../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        try {
            const { error, id } = GetUserIdMiddleware(req);
            if (error) return res.status(400).json({ massage: error });
            if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

            if (req.query["length"]) {
                const length = await prisma.post.count({ where: { authorId: id } });

                return res.status(200).json({ length })
            }

            const skip = Number(req.query["skip"]);
            const take = Number(req.query["take"]);


            if (typeof skip !== "number") return res.status(404).json({ massage: "skip is not a number" });
            if (typeof take !== "number") return res.status(404).json({ massage: "take is not a number" });

            const data = await prisma.user.findFirst({
                where: { id: id },
                skip: skip,
                take: take,
                select: {
                    blogName: true,
                    posts: {
                        select: {
                            slug: true,
                            _count: { select: { views: true } },
                            title: true,
                            id: true,
                            createdAt: true,
                            likes: { select: { isLike: true, isDislike: true } }
                        }
                    }
                }
            });

            return res.status(200).json({ data })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }

}
