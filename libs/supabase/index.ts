import supabase from './config';

class Storage {
    async uploadFile(file: File) {
        try {
            if (!file) return "No file Selected"
            if (file.size > 52428800) return "size is to big";
            const imageUrl = `https://nvyulqjjulqfqxirwtdq.supabase.co/storage/v1/object/public/iamges/${Date.now().toString()}${file.name}`

            return await supabase.storage.from("images").upload(imageUrl, file)
        } catch (error) {
            return error
        }
    }
}

export default Storage;