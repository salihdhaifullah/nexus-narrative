import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "GET") {
        try {
            const data = await prisma.views.groupBy({
                by: ["monthAndYear"],
                _count: true
            })

            return res.status(200).json({ data })
        } catch (error) {
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

}
