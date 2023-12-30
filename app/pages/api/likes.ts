import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { GetUserId } from '../../utils/auth';
import { Prisma } from '@prisma/client';

const handleLikes = async (like: { id: number, isLike: boolean, isDislike: boolean } | null, postId: number, userId: number, type: "like" | "dislike") => {
    if (!like) {
        let data: Prisma.LikeCreateInput = {
            user: { connect: { id: userId } },
            post: { connect: { id: postId } }
        }

        let data2: Prisma.PostUpdateInput = {}

        data[type === "like" ? "isLike" : "isDislike"] = true
        data2[type === "like" ? "likesCount" : "dislikesCount"] = { increment: 1 }

        await prisma.$transaction([
            prisma.like.create({ data: data }),
            prisma.post.update({ where: { id: postId }, data: data2 })
        ])

        return;
    }


    const data: Prisma.LikeUpdateInput = {}
    const data2: Prisma.PostUpdateInput = {}

    data["isLike"] = type === "like" ? !like.isLike : false
    data["isDislike"] = type === "like" ? false : !like.isDislike

    if (type === "like") {
        data2["likesCount"] = like.isLike ? { decrement: 1 } : { increment: 1 }
        data2["dislikesCount"] = like.isDislike ? { decrement: 1 } : undefined
    } else {
        data2["likesCount"] = like.isLike ? { decrement: 1 } : undefined
        data2["dislikesCount"] = like.isDislike ? { decrement: 1 } : { increment: 1 }
    }

    await prisma.$transaction([
        prisma.like.update({ where: { id: like.id }, data: data }),
        prisma.post.update({ where: { id: postId }, data: data2 })
    ])
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const id = Number(req.query["id"]);
            if (typeof id !== "number") return res.status(404).json({ massage: "Post Not Found" });

            const data = await prisma.post.findUnique({
                where: {id: id},
                select: { likesCount: true, dislikesCount: true }
            })

            return res.status(200).json({ likes: data?.likesCount, dislikes: data?.dislikesCount })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

    if (req.method === "PATCH") {
        try {

            const postId = Number(req.query["id"]);
            const { error, id: userId } = GetUserId(req)

            if (typeof userId !== "number" || error) return res.status(400).json({ massage: "User Not Found" });
            if (typeof postId !== "number") return res.status(400).json({ massage: "Post Not Found" });

            const likes = await prisma.like.findFirst({ where: { postId: postId, userId: userId }, select: { id: true, isDislike: true, isLike: true } })

            const type = req.query["type"]
            const typeOptions = ["like", "dislike"]

            if (typeof type !== "string" || !typeOptions.includes(type)) return res.status(400).json({ massage: "Bad Request" });

            await handleLikes(likes, postId, userId, type as "like" | "dislike")

            return res.status(200).json({ massage: "Success" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }
}
