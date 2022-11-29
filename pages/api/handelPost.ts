import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { GetUserIdMiddleware } from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {

        const postId = Number(req.query["id"]);
        const { error, id } = GetUserIdMiddleware(req)

        if (error) return res.status(400).json({ massage: error });
        if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

        if (typeof postId !== "number") return res.status(400).json({ massage: "Post Not Found" });

        const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true } });

        if (!user) return res.status(400).json({ massage: "User Not Found" })

        const likes = await prisma.like.findFirst({ where: {  postId: postId, userId: id }, select: { id: true, isDislike: true, isLike: true } })

        if (req.query["type"] === "like") {

            if (!likes) {
                console.log("like stage 1")
                await prisma.like.create({
                    data: {
                        isLike: true,
                        user: { connect: { id: id } },
                        post: { connect: { id: postId } }
                    }
                })

            } else if (likes.isDislike === true) {
                console.log("like stage 2")
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: true, isDislike: false }
                })
                
            } else if (likes.isLike === true) {
                console.log("like stage 3")
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: false, isDislike: false }
                })
            } else {
                console.log("like stage 4")
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: true, isDislike: false }
                })
            }


            return res.status(200).json({ massage: "Success" })
        }

        if (req.query["type"] === "dislike") {

            if (!likes) {
                console.log("dislike stage 1")
                await prisma.like.create({
                    data: {
                        isDislike: true,
                        user: { connect: { id: id } },
                        post: { connect: { id: postId } }
                    }
                })

            } else if (likes.isLike === true) {
                console.log("dislike stage 2")
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: false, isDislike: true }
                })

            } else if (likes.isDislike === true) {
                console.log("dislike stage 3")
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: false, isDislike: false }
                })
            } else {
                console.log("dislike stage 4")
                await prisma.like.update({
                    where: { id: likes.id },
                    data: { isLike: false, isDislike: true }
                })
            }

            return res.status(200).json({ massage: "Success" })
        }
    }

    if (req.method === "PUT") {

        const postId = Number(req.query["id"]);
        const UserIPAddress = req.socket.remoteAddress;

        const { error, id } = GetUserIdMiddleware(req)
        if (error) return res.status(400).json({ massage: error });

        if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

        if (typeof postId !== "number") return res.status(404).json({ massage: "post Id Not Found" });

        if (typeof UserIPAddress !== "string") return res.status(404).json({ massage: "Bad IP Address" });

        const view = await prisma.views.findFirst({
            where: { postId: postId, IPAddress: UserIPAddress },
            select: { id: true }
        })

        if (view?.id) return res.status(200).json({ massage: "all Ready Viewed" })

        const data = await prisma.views.create({
            data: {
                post: { connect: { id: postId } },
                IPAddress: UserIPAddress
            }
        });

        return res.status(200).json({ data });
    }
}