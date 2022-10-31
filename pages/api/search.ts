import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const search: string | any = req.query["search"];
    // 
    if (typeof search === 'string') {
      const posts = await prisma.post.findMany({
        where: {
          title: {
            contains: search,
          },
        },
        select: {
          backgroundImageUrl: true,
          title: true,
          slug: true,
          createdAt: true,
          author: {
            select: {
              blogName: true,
            },
          },
        }
      });

      return res.status(200).json({ posts });
    }
  }
  res.status(200).json({ name: 'John Doe' })
}



// category: {
//   name: {
//     contains: search,
//     mode: 'insensitive',
//   },
// },