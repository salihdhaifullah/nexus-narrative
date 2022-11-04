import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        if (req.query["type"] === 'blogs') {
            const blogName = [];

            const data = await prisma.user.findMany({
                where: {
                    NOT: [
                        {
                            blogName: null,
                        },
                    ],
                },
                select: {
                    blogName: true
                }
            })

            for (let item of data) {
                blogName.push({ params: item })
            }
            return res.status(200).json({ blogName });
        }

        if (req.query["type"] === 'slugs') {

            const slugs = []
            const data = await prisma.post.findMany({
                select: {
                    slug: true,
                    author: {
                        select: {
                            blogName: true,
                        },
                    },
                }
            })

            for (let item of data) {
                slugs.push({ params: { slug: item.slug, blogName: item.author.blogName } })
            }

            return res.status(200).json({ slugs });
        }


        if (req.query["type"] === 'users') {
            const ids = [];

            const data = await prisma.user.findMany({
                select: {
                    id: true
                }
            })

            for (let item of data) {
                ids.push({ params: { userId: item.id.toString() } })
            }

            return res.status(200).json({ ids });
        }
    }

    res.status(200).json({ massage: "you fucked up!" });
}