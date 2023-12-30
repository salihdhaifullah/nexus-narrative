import type { NextApiRequest, NextApiResponse } from 'next'
import { genSaltSync, hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../libs/prisma/index';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "GET") {

        try {
            let token = ""
            const fullYear = 1000 * 60 * 60 * 24 * 365;

            const demo = {
                email: "demo@gmail.com",
                firstName: "demo",
                lastName: "demo",
                password: "demo",
                blogName: "demo"
            }

            const user = await prisma.user.findFirst({
                where: { email: demo.email },
                select: {
                    id: true,
                    createdAt: true,
                    email: true,
                    lastName: true,
                    firstName: true,
                }
            });


            if (!user) {
                const salt = genSaltSync(10);
                const hashPassword = hashSync(demo.password, salt);

                const UserData = await prisma.user.create({
                    data: {
                        firstName: demo.firstName,
                        lastName: demo.lastName,
                        email: demo.email,
                        password: hashPassword,
                        blogName: demo.blogName
                    }
                })

                token = jwt.sign({ id: UserData.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

                res.setHeader('Set-Cookie', [
                    `token=${token}; HttpOnly; SameSite=strict Expires=${new Date(Date.now() + fullYear)}; Path=/; Max-Age=${fullYear}; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`,
                ]);

                return res.status(200).json({ data: UserData, massage: "login success as demo" })

            } else {

                token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

                res.setHeader('Set-Cookie', [
                    `token=${token}; HttpOnly; SameSite=strict Expires=${new Date(Date.now() + fullYear)}; Path=/; Max-Age=${fullYear}; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`,
                ]);

                const data = {
                    id: user.id,
                    createdAt: user.createdAt,
                    email: user.email,
                    lastName: user.lastName,
                    firstName: user.firstName,
                }

                return res.status(200).json({ data: data, massage: "login success as demo" })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

}

export default handler;
