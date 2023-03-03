import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { GetUserId } from '../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const id = Number(req.query["id"]);

            const { id: userId, error } = GetUserId(req);

            if (typeof id !== "number") return res.status(404).json({ massage: "Post Not Found" });

            const transactions = [
                prisma.like.count({ where: { isLike: true, postId: id } }),
                prisma.like.count({ where: { isDislike: true, postId: id } })
            ]

            if (userId) {
                const [likes, dislikes, isLiked] = await prisma.$transaction([
                    ...transactions,
                    prisma.like.findFirst({ where: { postId: id, userId: userId }, select: { isDislike: true, isLike: true } })
                ])
                return res.status(200).json({ likes, dislikes, isLiked })

            } else {
                const [likes, dislikes] = await prisma.$transaction(transactions)

                return res.status(200).json({ likes, dislikes })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }

    }

    if (req.method === "PATCH") {
        try {

            const postId = Number(req.query["id"]);
            const { error, id } = GetUserId(req)

            if (typeof id !== "number" || error) return res.status(400).json({ massage: "User Not Found" });
            if (typeof postId !== "number") return res.status(400).json({ massage: "Post Not Found" });

            const likes = await prisma.like.findFirst({ where: { postId: postId, userId: id }, select: { id: true, isDislike: true, isLike: true } })

            if (req.query["type"] === "like") {

                if (!likes) {
                    await prisma.like.create({
                        data: {
                            isLike: true,
                            user: { connect: { id: id } },
                            post: { connect: { id: postId } }
                        }
                    })

                } else if (likes.isDislike === true) {
                    await prisma.like.update({
                        where: { id: likes.id },
                        data: { isLike: true, isDislike: false }
                    })

                } else if (likes.isLike === true) {
                    await prisma.like.update({
                        where: { id: likes.id },
                        data: { isLike: false, isDislike: false }
                    })
                } else {
                    await prisma.like.update({
                        where: { id: likes.id },
                        data: { isLike: true, isDislike: false }
                    })
                }


                return res.status(200).json({ massage: "Success" })
            }

            if (req.query["type"] === "dislike") {

                if (!likes) {
                    await prisma.like.create({
                        data: {
                            isDislike: true,
                            user: { connect: { id: id } },
                            post: { connect: { id: postId } }
                        }
                    })

                } else if (likes.isLike === true) {
                    await prisma.like.update({
                        where: { id: likes.id },
                        data: { isLike: false, isDislike: true }
                    })

                } else if (likes.isDislike === true) {
                    await prisma.like.update({
                        where: { id: likes.id },
                        data: { isLike: false, isDislike: false }
                    })
                } else {
                    await prisma.like.update({
                        where: { id: likes.id },
                        data: { isLike: false, isDislike: true }
                    })
                }

                return res.status(200).json({ massage: "Success" })
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }
}
