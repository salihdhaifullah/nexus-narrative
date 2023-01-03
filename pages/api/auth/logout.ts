import { NextApiRequest, NextApiResponse } from 'next';
import { setCookie } from 'cookies-next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {

        try {
            setCookie("refresh-token", null, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 1000, // one seconde
                expires: new Date(Date.now() + 1000),
                path: "/",
                req,
                res
            })

            res.status(200).json({ message: 'Logout success' });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }
}

export default handler;
