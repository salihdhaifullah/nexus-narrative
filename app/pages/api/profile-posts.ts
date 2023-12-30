import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../libs/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const userId = Number(req.query["user-id"])
            const page = Number(req.query["page"])

            if (typeof page !== "number" || typeof userId !== "number") return res.status(400).json({ massages: "Bad Request" });

            const posts = await prisma.post.findMany({
                where: { authorId: userId },
                take: 5,
                skip: (page * 5),
                orderBy: { views: { _count: "desc" } },
                select: {
                    backgroundImage: true,
                    title: true,
                    slug: true,
                    description: true,
                    createdAt: true,
                    likesCount: true,
                    dislikesCount: true,
                    _count: {select: { comments: true }},
                    author: { select: { blogName: true } }
                }
            });

            return res.status(200).json({ posts });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massages: "Internal Server Error" });
        }
    }
};
