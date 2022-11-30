import supabase from './config';

interface IUploadFile {
    error: null | any;
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

    async uploadFile(file: string, fileName: string): Promise<IUploadFile> {
        try {

            const fileId = Date.now().toString() + fileName;
            const Url = `https://poousylnpfiblvwjmsge.supabase.co/storage/v1/object/public/public/${fileId}`;

            const Buffer = await base64toBuffer(file)

            const { error, data } = await supabase.storage.from("public").upload(fileId, Buffer, {contentType: `image/${fileName.split(".")[1]}` });
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