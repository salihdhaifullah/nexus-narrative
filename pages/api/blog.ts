import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const blogName = req.query["blogName"];
        const isHomePage = req.query["home"];
        if (!isHomePage) {
            if (typeof blogName !== "string") return res.status(400).json({ error: "Invalid blog name" });

            const posts = await prisma.post.findMany({
                take: 5,
                where: {
                    author: {
                        blogName: blogName,
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    backgroundImage: true,
                    title: true,
                    slug: true,
                    createdAt: true,
                },
                
            })
    
           return res.status(200).json({ posts })
        } 
        if (isHomePage) {
            if (typeof blogName !== "string") return res.status(400).json({ error: "Invalid blog name" });

            const data = await prisma.user.findFirst({
                where: {
                    blogName: blogName
                },
                select: {
                    about: true,
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    profile: true
                }
            })
    
            const posts = await prisma.post.findMany({
                where: { author: { blogName: blogName } },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    backgroundImage: true,
                    title: true,
                    slug: true,
                    createdAt: true,
                },
            })
    
           return res.status(200).json({ data, posts })
        }
    } 

    if (req.method === "PUT") {
        const category = req.query["category"];
        
        if (typeof category !== "string") return res.status(400).json({ error: "Invalid category" });

        const PostsRelated = await prisma.post.findMany({
            take: 5,
            where: {
                category: {
                    name: category
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                backgroundImage: true,
                title: true,
                slug: true,
                createdAt: true,
            },
        })

        return res.status(200).json({ PostsRelated })
    } 

    res.status(200).json({ name: 'John Doe' })
}