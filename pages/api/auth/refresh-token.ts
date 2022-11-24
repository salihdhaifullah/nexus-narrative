import jwt  from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { GetUserIdMiddlewareFromCookie } from '../../../middleware';
import prisma from '../../../libs/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "GET") {
        const {error, id} = GetUserIdMiddlewareFromCookie(req)
        if (error) return res.status(400).json({ massage: error });
        if (id === null) return res.status(400).json({ massage: "User Not Found" });

        const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true } });

        if (!user) return res.status(404).json({ massage: "user Not Found" });

        const token = jwt.sign({ id: id }, process.env.SECRET_KEY as string, { expiresIn: (1000 * 60 * 5) })
        
        return res.status(200).json({token})

    }
}

export default handler;