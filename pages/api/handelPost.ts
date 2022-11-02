import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { GetUserIdMiddleware } from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const slug = req.query["slug"] as string;
        const { error, id } = GetUserIdMiddleware(req)

        if (error) return res.status(400).json({massage: error});

        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
            select: {
                id: true
            }
        });

        if (!user) return res.status(400).json({massage: "User Not Found"})
        const likes = await prisma.post.findFirst({
            where: {
                slug: slug,
            },
            select: {
                likes: true,
                dislikes: true,
                id: true,
            },
        })

        if (typeof likes?.likes === "undefined" || typeof likes?.dislikes === "undefined") return res.status(400).json({massage: "some think wrong"})

        if (req.query["type"] === "like") {
            

            let data = [];
            // i used a for loop to insert likes cuz they are a pointer bug here
            for (let like of likes.likes) {
                data.push(like)
            }
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
  
}