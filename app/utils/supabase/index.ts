import supabase from './config';
import { randomUUID } from 'crypto';


interface IUploadFile {
    error: null | unknown;
    Url: string;
}

function base64toBuffer(base64: string) {
    return (
        fetch(base64)
            .then(async (res) => {
                const buffer = await res.arrayBuffer()
                return buffer;
            })
    );
}

class Storage {

    async uploadFile(file: string): Promise<IUploadFile> {
        try {
            const SUPABASE_URL = process.env.SUPABASE_URL;
            if (!SUPABASE_URL) throw new Error("SUPABASE_URL  Not Found");

            const fileId = Date.now().toString() + randomUUID() + '.webp';
            const Url = `${SUPABASE_URL}/storage/v1/object/public/public/${fileId}`;

            const Buffer = await base64toBuffer(file)

            const { error } = await supabase.storage.from("public").upload(fileId, Buffer, {contentType: "image/webp" });
            return { error, Url };

        } catch (error) {
            console.log(error)
            throw new Error("internal Server Error")
        }
    }

    async deleteFile(filePath: string) {
        try {
            await supabase.storage.from("public").remove([filePath])
        } catch (error) {
            throw new Error("internal Server Error")
        }
    }

}

export default Storage;
