import jwt from "jsonwebtoken";
import type { NextApiRequest } from 'next'

interface IGetUserIdMiddleware {
    error?: any
    id?: number
}


export const GetUserIdMiddleware = (req: NextApiRequest): IGetUserIdMiddleware => {
    const data: IGetUserIdMiddleware = { error: undefined, id: undefined }

    if (process.env.SECRET_KEY) {
        if (req.cookies['refresh-token']) {
            jwt.verify(req.cookies['refresh-token'], process.env.SECRET_KEY, (err: any, decodedToken: any) => {
                if (err) data.error = err
                else data.id = Number(decodedToken.id);
            });
        } else data.error = "no token found"
        
    } else data.error = "Server Error"
    return data;
}