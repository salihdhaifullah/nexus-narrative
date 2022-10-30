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
            },
        })

        if (typeof likes?.likes === "undefined" || typeof likes?.dislikes === "undefined") return res.status(400).json({massage: "some think wrong"})

        if (req.query["type"] === "like") {
            let data = likes.likes;
            data.push(`${user.id}`);
            let disLikes = null; 
            let isLiked = false;
            if (likes.dislikes.find((id) => id === `${user.id}`)) disLikes = likes.dislikes.filter((id) => id === `${user.id}`);
            if (likes.likes.find((id) => id === `${user.id}`)) isLiked = true;
            
            if (isLiked) return res.status(200).json({likes});

            if (disLikes) {
                await prisma.post.update({
                    where: {
                        slug: slug,
                    },
                    data: {
                        likes: data,
                        dislikes: disLikes,
                    }
                })


                return res.status(200).json({likes})
            }


            await prisma.post.update({
                where: {
                    slug: slug,
                },
                data: {
                    likes: data
                }
            })

            return res.status(200).json({likes})
        }

        if (req.query["type"] === "dislike") {
            let data = likes.dislikes;
            data.push(`${user.id}`);
            let Likes = null; 
            let isDisLiked = false;
            if (likes.likes.find((id) => id === `${user.id}`)) Likes = likes.likes.filter((id) => id === `${user.id}`);
            if (likes.dislikes.find((id) => id === `${user.id}`)) isDisLiked = true;
            
            if (isDisLiked) return res.status(200).json({likes});

            if (Likes) {
                await prisma.post.update({
                    where: {
                        slug: slug,
                    },
                    data: {
                        dislikes: data,
                        likes: Likes,
                    }
                })

                return res.status(200).json({likes})
            }


            await prisma.post.update({
                where: {
                    slug: slug,
                },
                data: {
                    dislikes: data
                }
            })

            return res.status(200).json({likes})
        }


    }
  
    res.status(200).json({massage: "Hello World"})
}