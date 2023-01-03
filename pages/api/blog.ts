import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        try {
            const blogName = req.query["blog-name"];

            if (typeof blogName !== "string") return res.status(404).json({ massage: "Blog Name Not Found" });

            const posts = await prisma.post.findMany({
                where: { author: { blogName: blogName } },
                orderBy: { createdAt: "desc" },
                select: {
                    backgroundImage: true,
                    title: true,
                    slug: true,
                    createdAt: true,
                    author: { select: { blogName: true } },
                    description: true
                }
            });

            return res.status(200).json({ posts })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }
}
