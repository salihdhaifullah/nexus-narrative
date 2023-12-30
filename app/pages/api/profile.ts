import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'
import { GetUserId } from '../../utils/auth'
import { IUpdateProfileGeneralInformation } from '../../types/profile';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === "PATCH") {
        try {
            const { phoneNumber, country, city, firstName, lastName, email, title, about }: IUpdateProfileGeneralInformation = req.body;

            if (!lastName || !email || !firstName) return res.status(400).json({ massage: "LastName, Email, FirstName Are Required" });

            const { error, id } = GetUserId(req);
            if (typeof id !== "number" || error) return res.status(404).json({ massage: "User Not Found" });

            await prisma.user.update({
                where: { id: id },
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
            const data: { blogName: string } = req.body
            const { error, id } = GetUserId(req);
            if (typeof id !== "number" || error) return res.status(404).json({ massage: "User Not Found" });

            const blogName = data.blogName

            const isMatch = new RegExp("^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$").test(blogName);

            if (!isMatch) return res.status(400).json({ massage: "unValid Blog Name" });

            const isFoundSameName = await prisma.user.findFirst({ where: { blogName: blogName, NOT: {id: id} }, select: { id: true } });

            if (isFoundSameName) return res.status(400).json({ massage: "blog Name Is All ready exist" });

            await prisma.user.update({ where: { id: id }, data: { blogName: blogName } });

            return res.status(200).json({ massage: 'Success' })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ massage: "internal Server Error" })
        }
    }

}
