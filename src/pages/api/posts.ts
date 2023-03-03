import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../libs/prisma";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const blogName = req.query["blog-name"]
            const page = Number(req.query["page"])
            const take =  Number(req.query["take"])

            if (typeof blogName !== "string" || typeof page !== "number" || typeof take !== "number") return res.status(400).json({ massages: "Bad Request" });

            const posts = await prisma.user.findFirst({
                where: { blogName: blogName },
                select: {
                  posts: {
                    take: take,
                    skip: (page * take),
                    select: {
                      slug: true,
                      _count: { select: { views: true } },
                      title: true,
                      id: true,
                      createdAt: true,
                      likesCount: true,
                      dislikesCount: true
                    }
                  }
                }
              });

              return res.status(200).json({ posts });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massages: "Internal Server Error" });
        }
    }
};
