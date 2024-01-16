import supabase from './config';
import { randomUUID } from 'crypto';

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
    static async uploadFile(file: string | Buffer): Promise<string> {
        const SUPABASE_URL = process.env.SUPABASE_URL;
        if (!SUPABASE_URL) throw new Error("SUPABASE_URL  Not Found");

        const fileId = Date.now().toString() + randomUUID() + '.webp';
        const Url = `${SUPABASE_URL}/storage/v1/object/public/public/${fileId}`;

        const Buffer = typeof file === "string" ? await base64toBuffer(file) : file

        const { error } = await supabase.storage.from("public").upload(fileId, Buffer, { contentType: "image/webp" });

        if (error) throw error;

        return Url;
    }

    static async deleteFile(filePath: string) {
        try {
            await supabase.storage.from("public").remove([filePath])
        } catch (error) {
            throw new Error("internal Server Error")
        }
    }

}

export default Storage;
