import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { GetUserIdMiddleware } from '../../middleware';
import { ICommentData } from '../../types/comment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { error, id } = GetUserIdMiddleware(req)
        if (!id) return res.status(404).json({ massage: "user Not Found" })
        if (error) return res.status(400).json({ massage: error })

        const user = await prisma.user.findUnique({ where: { id: id }, select: { id: true } });

        if (!user?.id) return res.status(404).json({ massage: "user Not Found" });

        const { comment, postId }: ICommentData = req.body;

        const commentData = await prisma.comment.create({
            data: {
                content: comment,
                author: { connect: { id: id }}, 
                post: { connect: { id: postId } }
            }
        });

        return res.status(200).json({ commentData })
    }

    if (req.method === "DELETE") {
        const { error, id } = GetUserIdMiddleware(req)
        const commentId = Number(req.query["id"]);

        if (typeof id !== "number") return res.status(404).json({ massage: "user Not Found" })

        if (error) return res.status(400).json({ massage: error })

        if (!commentId) return res.status(404).json({ massage: "comment Not Found" })

        const comment = await prisma.comment.findFirst({ where: { id: commentId, authorId: id }, select: { id: true } })

        if (!comment?.id) return res.status(404).json({ massage: "comment Not Found" })

        await prisma.comment.delete({ where: { id: commentId } })

        return res.status(200).json({ massage: "success Deleting comment" });
    }

    if (req.method === "PATCH") {
        const { error, id } = GetUserIdMiddleware(req)
        const {content}: {content: string} = req.body;
        const commentId = Number(req.query["id"]);

        if (typeof id !== "number") return res.status(404).json({ massage: "user Not Found" })

        if (error) return res.status(400).json({ massage: error })

        if (!commentId) return res.status(404).json({ massage: "comment Not Found" })
 

        const user = await prisma.user.findUnique({ where: { id: id }, select: { id: true } });

        const comment = await prisma.comment.findFirst({ where: { id: commentId, authorId: id }, select: { id: true } })

        if (!user?.id) return res.status(404).json({ massage: "user Not Found" });

        if (!comment?.id) return res.status(404).json({ massage: "comment Not Found" });
 


        await prisma.comment.update({ where: { id: commentId }, data: { content: content } });
    
        return res.status(200).json({ massage: "Comment Successfully Updated" });
    }
}