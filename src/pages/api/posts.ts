import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../libs/prisma";
import { Prisma } from "@prisma/client";

  const filterQuery = (title: unknown, category: unknown) => {
      let query: Prisma.PostWhereInput = {}

      if (typeof title === "string" && title.length > 0) {
          query["title"] = { contains: title, mode: 'insensitive' }
      }

      if (typeof category === 'string' && category.length > 2) {
        query["category"] = { name: category }
      }

      return query;
  }

  const SortQuery = (sort: unknown) => {
      let query: Prisma.PostOrderByWithRelationInput = {}
      const sortOptions = ["views", "likes", "dislikes", "date"]

      if (typeof sort !== "string" || sort.length < 1 || !sortOptions.includes(sort)) return query;

      if (sort === "views") query = { views: { _count: "desc" } }
      else if (sort === "likes") query = { likesCount: "desc" }
      else if (sort === "dislikes") query = { dislikesCount: "desc" }
      else query = { createdAt: "desc" }

      return query;
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const blogName = req.query["blog-name"]
            const page = Number(req.query["page"])
            const take =  Number(req.query["take"])
            const sort = req.query["sort"]
            const title = req.query["title"]
            const category = req.query["category"]

            if (typeof blogName !== "string" || typeof page !== "number" || typeof take !== "number") return res.status(400).json({ massages: "Bad Request" });

            const posts = await prisma.user.findFirst({
                where: { blogName: blogName },
                select: {
                  posts: {
                    take: take,
                    skip: (page * take),
                    where: filterQuery(title, category),
                    orderBy: SortQuery(sort),
                    select: {
                      slug: true,
                      _count: { select: { views: true } },
                      title: true,
                      id: true,
                      category: { select: { name: true } },
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
