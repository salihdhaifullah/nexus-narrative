import { SortByType } from './../../types/post';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const category = req.query["category"];

        const filterQuery = typeof category === "string" ? { where: { category: { name: category } } } : null;

        if (req.query["length"]) {
            let length;

            if (!filterQuery) length = await prisma.post.count()
            else length = await prisma.post.count(filterQuery)
            
            return res.status(200).json({ length })
        }

        const skip = Number(req.query["skip"]);
        const take = Number(req.query["take"]);
        const sort: SortByType | any = req.query["sort"];

        if (!["Likes", "Views", "CreateAt"].includes(sort)) return res.status(404).json({ massage: "Sort unValid" })

        let orderBy: { likes: { _count:  "asc"; }; } | { views: { _count: "desc"; }; } | { createdAt: "desc" } = { createdAt: "desc" };

        switch (sort) {
            case "Likes": orderBy = { likes: { _count: "asc" } }
            break;
            case "Views": orderBy = { views: { _count: "desc" } }
            break;
            case "CreateAt": orderBy = { createdAt: "desc" }
            default: orderBy = { createdAt: "desc" }
        }

        if (typeof skip !== "number") return res.status(404).json({ massage: "skip is not a number" });
        if (typeof take !== "number") return res.status(404).json({ massage: "take is not a number" });

        let posts;
        if (filterQuery) {
            posts = await prisma.post.findMany({

                orderBy: orderBy,
                where: filterQuery.where,
                skip: skip,
                take: take,
                select: {
                    author: { select: { blogName: true } },
                    backgroundImage: true,
                    title: true,
                    slug: true,
                    createdAt: true,
                    description: true
                }
            });
        } else {
            posts = await prisma.post.findMany({
                orderBy: orderBy,
                skip: skip,
                take: take,
                select: {
                    author: { select: { blogName: true } },
                    backgroundImage: true,
                    title: true,
                    slug: true,
                    createdAt: true,
                    description: true
                }
            });
        }


        return res.status(200).json({ posts });

    }


    if (req.method === 'POST') {

    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {

    }
};