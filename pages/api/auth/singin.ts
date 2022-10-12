import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma/index'
import { genSaltSync, hashSync } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';


interface ISingUp {
    password: string
    email: string
    name: string
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        const { password, email, name }: ISingUp = req.body
        const user = await prisma.user.findUnique({ where: { email: email } })
        try {

            if (!user) {

                if (password && name && email) {
                    const salt = genSaltSync(10);
                    const hashPassword = hashSync(password, salt)
                    const UserData = await prisma.user.create({
                        data: {
                            name: name,
                            email: email,
                            password: hashPassword
                        }
                    })

                    const token = jwt.sign({ id: UserData.id, role: UserData.role }, process.env.SECRET_KEY as string, { expiresIn: '2h' })
                    
                    const fullYear = 1000 * 60 * 60 * 24 * 365;
                    
                    const refreshToken = jwt.sign({ id: UserData.id }, process.env.SECRET_KEY as string, { expiresIn: fullYear })


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
                        id: UserData.id, 
                        createdAt: UserData.createdAt, 
                        email: UserData.email, 
                        name: UserData.name, 
                        token
                     } 

                    return res.status(200).json({ data, massage: "sing up success" })
                }
                else return res.status(400).json({ error: 'you must fill all fields' })
            }
            else return res.status(400).json({ error: "user already exist try login" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: 'server error' })
        }
    }
    else return res.status(404).json({ massage: `this method ${req.method} is not allowed` })

}

export default handler;