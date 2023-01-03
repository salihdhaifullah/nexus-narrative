import type { NextApiRequest, NextApiResponse } from 'next'
import { genSaltSync, hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';
import prisma from '../../../libs/prisma/index';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "GET") {

        try {
            let refreshToken = ""
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

                refreshToken = jwt.sign({ id: UserData.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

                setCookie("refresh-token", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: fullYear, // full year
                    expires: new Date(Date.now() + fullYear),
                    path: "/",
                    req,
                    res
                })

                return res.status(200).json({ data: UserData, massage: "login success as demo" })

            } else {

                refreshToken = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })

                setCookie("refresh-token", refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: fullYear, // full year
                    expires: new Date(Date.now() + fullYear),
                    path: "/",
                    req,
                    res
                })


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
