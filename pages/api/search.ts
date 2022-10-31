import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const search: string | any = req.query["search"];
    const tag: string | any = req.query["tag"];
    const category: string | any = req.query["category"];

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

    else if (typeof tag === 'string') {
      const posts = await prisma.tag.findFirst({
        where: {
          name: {
            contains: tag,
          },
        },
        select: {
          Post: {
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
          }
        }
      });

      return res.status(200).json({ posts });
    }


    else if (typeof category === 'string') {
      const posts = await prisma.post.findMany({
        where: {
          category: {
            name: {
              contains: category,
            },
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



