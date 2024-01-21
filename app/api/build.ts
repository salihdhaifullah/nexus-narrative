import { json } from "@remix-run/node";
import fs from "fs/promises";
import path from "path";

const filesArray: string[] = [];

export const loader = async () => {
    if (filesArray.length) {
        console.log("cached filesArray")
        return json(filesArray);
    }
    const directoryPath = path.resolve(path.join(process.cwd(), "./public"));
    await readDirectory(directoryPath, filesArray, directoryPath);
    return json(filesArray);
};

async function readDirectory(directoryPath: string, filesArray: string[], base: string) {
    const files = await fs.readdir(directoryPath);

    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const fileStat = await fs.stat(filePath);

        if (fileStat.isDirectory()) {
            await readDirectory(filePath, filesArray, base);
        } else {
            const relativePath = filePath.replace(base, "");
            filesArray.push(relativePath);
        }
    }
}
