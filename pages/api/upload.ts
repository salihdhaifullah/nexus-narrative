import formidable from "formidable";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../libs/prisma";
import { GetUserIdMiddleware } from "../../middleware";

export const config = {
    api: {
        bodyParser: false
    }
};

interface IFileStream {
    filepath: string;
    originalFilename: string;
}

const ProcessFiles = (Files: any): IFileStream[] => {
    const data: IFileStream[] = [];
    let index = 0;

    while (Boolean(Files[`file${index}`])) {
        data.push(Files[`file${index}`] as IFileStream)
        index++;
    }

    return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {

        const { error, id } = GetUserIdMiddleware(req);
        if (error) return res.status(400).json({ massage: error })
        if (!id) return res.status(404).json({ massage: "User not found" });

        const form = new formidable.IncomingForm();

        form.parse(req, async function (err, fields, files) {

            const filesArray = ProcessFiles(files)

            if (filesArray.length === 0) return res.status(401).json({ massages: "No File Found" });
            
            if (filesArray.length > 1) return res.status(401).json({ massage: "Multiple files Not Allowed" });

            const data = fs.readFileSync(filesArray[0].filepath);

            const name = `${Date.now().toString() + filesArray[0].originalFilename}`;

            const isFound = await prisma.user.findUnique({ where: { id: id }, select: { profile: true } });

            if (isFound?.profile) fs.unlinkSync(`./public/uploads/${isFound.profile}`);

            // create 'uploads' folder if not exist
            fs.mkdirSync("./public/uploads", { recursive: true });

            await fs.access(`./public/uploads/${name}`, fs.constants.R_OK, async (err) => {
                if (err) await fs.writeFileSync(`./public/uploads/${name}`, data);
            })

            fs.unlinkSync(filesArray[0].filepath);

            await prisma.user.update({ where: { id: id }, data: { profile: name } });

            return res.status(200).json({ massage: "Success uploading avatar", name });
        });

    }
};