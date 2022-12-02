import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../libs/prisma";
import Storage from "../../libs/supabase";
import { GetUserIdMiddleware } from "../../middleware";
import { IUploadAvatar } from "../../types/profile";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '2mb'
        }
    }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {

            const { error, id } = GetUserIdMiddleware(req);
            if (error) return res.status(400).json({ massage: error })
            if (!id) return res.status(404).json({ massage: "User not found" });
            const { base64 }: IUploadAvatar = req.body;
            const storage = new Storage();

            if (!base64) return res.status(401).json({ massages: "No File Found" });

            const MB = 1048576; // 1mb 
            // calculate the acutely File size from base64 encoding    
            if (Buffer.from(base64).length > (MB + (MB * 0.33))) return res.status(401).json({ massages: "File size is too big" });
            console.log(Buffer.from(base64).length)
            const isFound = await prisma.user.findUnique({ where: { id: id }, select: { profile: true } });

            if (isFound?.profile) await storage.deleteFile(isFound.profile.split("/public/public/")[1]);

            const { error: storageError, Url } = await storage.uploadFile(base64)

            if (storageError) return res.status(500).json({ massages: storageError })

            if (!Url) return res.status(400).json({ massages: "Some Thing went wrong" });

            await prisma.user.update({ where: { id: id }, data: { profile: Url } });

            return res.status(200).json({ massage: "Success uploading avatar", name: Url });

        } catch (error) {
            console.log(error)
            return res.status(500).json({ massages: "Internal Server Error" });
        }

    }
};