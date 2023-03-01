import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

type TSearchQuery =
  { OR: [{ title: { contains: string, mode: 'insensitive' } }, { description: { contains: string, mode: 'insensitive' } }] }
  | { category: { name: { contains: string, mode: 'insensitive' } } }
  | { tags: { every: { name: { contains: string, mode: 'insensitive' } } } };



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {

    try {
      const search: string | any = req.query["search"];
      const tag: string | any = req.query["tag"];
      const category: string | any = req.query["category"];
      const skip = Number(req.query["skip"])
      const take = Number(req.query["take"])
      const getLength = req.query["get-length"];

      let searchQuery: TSearchQuery = { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }

      if (typeof search === 'string') searchQuery = { OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }] }
      else if (typeof tag === 'string') searchQuery = { tags: { every: { name: { contains: tag, mode: 'insensitive' } } } }
      else if (typeof category === 'string') searchQuery = { category: { name: { contains: category, mode: 'insensitive' } } };


      if (getLength) {
        const posts = await prisma.post.count({ where: searchQuery });
        return res.status(200).json({ posts });
      } else {
        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

        const posts = await prisma.post.findMany({
          where: searchQuery,
          skip: skip,
          take: take,
          select: {
            backgroundImage: true,
            title: true,
            description: true,
            slug: true,
            createdAt: true,
            author: { select: { blogName: true } }
          }
        });

        return res.status(200).json({ posts });
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({ massage: "internal Server Error" })
    }

  }
};
