import { BsFileEarmarkImage } from "react-icons/bs";
import toWEBPImage from "../../../utils/toWEBPImage";
import { MutableRefObject, useId } from "react";
import { setRange, useTextarea } from "./util";

interface IImageProps {
    files: MutableRefObject<{base64: string; previewUrl: string;}[]>
}


const Image = (props: IImageProps) => {
    const textarea = useTextarea();

    const insertImage = async (file: File | null) => {
        if (file === null) return;

        // because react markdown validate the urls
        const previewUrl = `/${URL.createObjectURL(file)}`;
        const base64 = await toWEBPImage(file);
        props.files.current.push({base64, previewUrl});

        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("insertText", false, `\n![${file.name}](${previewUrl})\n`);

        setRange(textarea, start + 5 + file.name.length + previewUrl.length);
    }

    const id = useId()
    return (
        <>
            <input type="file" id={id} className="hidden" accept="image/*" onChange={(e) => insertImage(e?.target?.files ? e?.target?.files[0] : null)} />
            <label htmlFor={id} title="Image">
                <button className="flex justify-center items-center">
                    <BsFileEarmarkImage className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl p-0.5 rounded-sm cursor-pointer" />
                </button>
            </label>
        </>
    )
}

export default Image;
