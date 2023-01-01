import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        const data = await prisma.views.groupBy({
            by: ["monthAndYear"],
            _count: true
        })

        return res.status(200).json({ data })
    }

}
