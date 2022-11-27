import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { GetUserIdMiddleware } from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "PATCH") {

        const slug = req.query["slug"] as string;
        const { error, id } = GetUserIdMiddleware(req)


        if (error) return res.status(400).json({massage: error});
        if (typeof id !== "number") return res.status(400).json({massage: "User Not FOund" });

        const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true } });

        if (!user) return res.status(400).json({massage: "User Not Found"})
        
        const likes = await prisma.post.findFirst({ where: { slug: slug }, select: { likes: true, dislikes: true, id: true } });

        if (!likes?.likes || !likes?.dislikes) return res.status(400).json({massage: "some thing wrong"});

        if (req.query["type"] === "like") {
            let data = [];
            for (let like of likes.likes) { data.push(like) }

            data.push(`${user.id}`);
            
            let disLikes: string[] = []; 
            let isLiked = false;
            if (likes.dislikes.find((id) => id === `${user.id}`)) disLikes = likes.dislikes.filter((id) => id !== `${user.id}`);
            
            if (likes.likes.find((id) => id === `${user.id}`)) isLiked = true;

            if (isLiked) data = data.filter((id) => id !== `${user.id}`);


            await prisma.post.update({
                where: {
                    slug: slug,
                    id: likes.id,
                },
                data: {
                    likes: {set: data},
                    dislikes: {set: disLikes} ,
                }
            })
            return res.status(200).json({likes})
        }

        if (req.query["type"] === "dislike") {            
            let data = [];
            // i used a for loop to insert dislikes cuz they are a pointer bug here
            for (let like of likes.dislikes) {
                data.push(like)
            }
            data.push(`${user.id}`);

            let Likes: string[] = []; 
            let isDisLiked = false;

            if (likes.likes.find((id) => id === `${user.id}`)) Likes = likes.likes.filter((id) => id !== `${user.id}`);
            
            if (likes.dislikes.find((id) => id === `${user.id}`)) isDisLiked = true;
            
            if (isDisLiked) data = data.filter((id) => id !== `${user.id}`);


                await prisma.post.update({
                    where: {
                        slug: slug,
                        id: likes.id,
                    },
                    data: {
                        dislikes: {set: data},
                        likes: {set: Likes}, 
                    }
                })
                return res.status(200).json({likes})
        }
    }

    if (req.method === "GET") {

        const posts = await prisma.post.findMany({
            orderBy: { views: { _count: 'desc' } },
            select: {
                author: { select: { blogName: true } },
                backgroundImage: true,
                title: true,
                slug: true,
                createdAt: true
            }
        });

        return res.status(200).json({posts});

    }



    if (req.method === "PUT") {

        const postId = Number(req.query["id"]);
        const UserIPAddress = req.socket.remoteAddress;

        const { error, id } = GetUserIdMiddleware(req)
        if (error) return res.status(400).json({massage: error});

        if (typeof id !== "number") return res.status(400).json({massage: "User Not FOund" });

        if (typeof postId !== "number") return res.status(404).json({massage: "post Id Not Found"});

        if (typeof UserIPAddress !== "string") return res.status(404).json({massage: "Bad IP Address"});

        const view = await prisma.views.findFirst({
            where: { postId: postId, IPAddress: UserIPAddress },
            select: { id: true }
        })

        if (view?.id) return res.status(200).json({ massage: "all Ready Viewed"})
        
        const data = await prisma.views.create({
            data: {
                post: { connect: {id: postId } },
                IPAddress: UserIPAddress
            }
        });

        return res.status(200).json({data});
    }
}