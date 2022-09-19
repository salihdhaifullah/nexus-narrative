import { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from 'cookies-next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "GET") {
        const refreshToken = getCookie("refresh-token")
        console.log(refreshToken);
        res.status(200).json({refreshToken: refreshToken})
    } else return res.status(404).json({ massage: `this method ${req.method} is not allowed` });

}

export default handler;