import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        try {
            if (req.query["create-post"]) {
                const tags =  prisma.tag.findMany({ select: { name: true } });
                const categories =  prisma.category.findMany({ select: { name: true } });
                const [result1, result2] = await Promise.all([tags, categories])
                return res.status(200).json({ tags: result1, categories: result2 })
            }

            if (req.query["category"]) {
                const categories = await prisma.category.findMany({ select: { name: true } });
                return res.status(200).json({ categories })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }
}
