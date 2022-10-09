import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const data = await prisma.post.findMany({
            select: {
                tags: true,
                category: true
            }
        })
        res.status(200).json(data)

    } else if (req.method === "POST") {


        const data = await prisma.post.create({
            data: {
                tags: {
                    connectOrCreate: [{
                        where: {
                            name: 'Seegwvdgwe',
                          },
                          create: {
                            name: "Seegwvdgwe"
                          }
                    }, {
                        where: {
                            name: 'Wegweewg',
                          },
                          create: {
                            name: "Wegweewg"
                          }
                    }, {
                        where: {
                            name: 'wfe',
                          },
                          create: {
                            name: "wfe"
                          }
                    }],
                },
                title: "dddsfswe",
                content: "dsesdfsfsf",
                images: {
                    connectOrCreate: [{
                        where: {
                            fileUrl: "fegwegweg",
                        },
                        create: {
                            fileUrl: "fegwegwegUrl",
                            name: "Hello"
                        }
                    }]
                },
                category: {
                    connectOrCreate: {
                        where: {
                            name: "dddddd"
                        },
                        create: {
                            name: "dddddd"
                        }
                    },
                },
                slug: "weggwegwegeweg",
                author: {
                    connect: { id: "3c747b75-460d-4fae-aeac-93f243f33a20" },
                },
            },
            include: {
                tags: true,
                category: true,
                author: true
            },
        })

        return res.status(200).json({ data, massage: "" });
    } else return res.status(404).json({ massage: `this method ${req.method} is not allowed` });
}
