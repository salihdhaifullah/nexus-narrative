import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'
import { GetUserIdMiddleware } from '../../../middleware'
import { IChangeBlogName, IUpdateProfileGeneralInformation } from '../../../types/profile';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            let UserId = null
            const { error, id } = await GetUserIdMiddleware(req)
            if (req.query["userId"]) UserId = Number(req.query["userId"]);
            else {
                if (error) return res.status(400).json({ massage: error });
                UserId = id
            };

            if (typeof UserId !== "number") return res.status(404).json({ massage: "User Not Found" })

            const user = await prisma.user.findFirst({
                where: { id: UserId },
                select: {
                    profile: true,
                    firstName: true,
                    lastName: true,
                    title: true,
                    about: true,
                    email: true,
                    blogName: true,
                    phoneNumber: true,
                    country: true,
                    city: true,
                },
            })

            if (!user) return res.status(404).json({ massage: "user Not Found" });

            return res.status(200).json({ user })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }
    if (req.method === "PATCH") {
        try {
            const { phoneNumber, country, city, firstName, lastName, email, title, about }: IUpdateProfileGeneralInformation = req.body;

            if (!lastName || !email || !firstName) return res.status(400).json({ massage: "LastName, Email, FirstName Are Required" });

            const { error, id } = GetUserIdMiddleware(req);

            if (error) return res.status(400).json({ massage: error });

            if (typeof id !== "number") return res.status(404).json({ massage: "User Not Found" });

            const user = await prisma.user.findFirst({ where: { id: id, }, select: { id: true, } });

            if (!user) return res.status(404).json({ massage: "user Not Found" });

            await prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    country: country || null,
                    city: city || null,
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: Number(phoneNumber) || null,
                    title: title || null,
                    about: about || null,
                },
            });

            return res.status(200).json({ massage: 'Success to update Profile' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

    if (req.method === "PUT") {
        try {
            const data: IChangeBlogName = req.body
            const { error, id } = GetUserIdMiddleware(req);
            if (typeof id !== "number") return res.status(404).json({ massage: "User Not Found" });
            if (error) return res.status(400).json({ massage: error });
            const blogName = data.blogName.toLocaleLowerCase()

            const isMatch = new RegExp("^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$").test(blogName);

            if (!isMatch) return res.status(400).json({ massage: "unValid Blog Name" });

            const user = await prisma.user.findFirst({ where: { id: id }, select: { id: true } });

            const isFoundSameName = await prisma.user.findFirst({ where: { blogName: blogName }, select: { id: true } });

            if (!user) return res.status(404).json({ massage: "user Not Found" });

            if (isFoundSameName) return res.status(400).json({ massage: "blog Name Is All ready exist" });

            await prisma.user.update({ where: { id: id }, data: { blogName: blogName } });

            return res.status(200).json({ massage: 'Success' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

}
