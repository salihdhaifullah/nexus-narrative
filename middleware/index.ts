import jwt from "jsonwebtoken";
import type { NextApiRequest } from 'next'

interface IGetUserIdMiddleware {
    error: any | null
    id: number | null
}

interface IGetUserIdAndRoleMiddleware {
    error: any | null
    id: number | null
    role: 'PROJECT_MANAGER' | 'DEVELOPER' | 'ADMIN' | null;
}


export const GetUserIdMiddlewareFromCookie = (req: NextApiRequest): IGetUserIdMiddleware => {
    const data: IGetUserIdMiddleware = { error: null, id: null }

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

export const GetUserIdMiddleware = (req: NextApiRequest): IGetUserIdMiddleware => {
    const data: IGetUserIdMiddleware = { error: null, id: null }

    if (process.env.SECRET_KEY) {
        if (req.headers["authorization"]?.split("Bearer ")[1]) {
            jwt.verify(req.headers["authorization"].split("Bearer ")[1], process.env.SECRET_KEY, (err: any, decodedToken: any) => {
                if (err) data.error = err
                else data.id = Number(decodedToken.id);
            });
        } else data.error = "no token found"
        
    } else data.error = "Server Error"
    return data;
}
