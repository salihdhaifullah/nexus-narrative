import { ForwardedRef, HTMLProps, ReactNode, forwardRef, useId, useMemo, useRef, useState } from "react";
import { IconType } from "react-icons";

export interface IValidate {
    validate: (str: string) => boolean;
    massage: string
}

interface TextFiledProps extends HTMLProps<HTMLInputElement> {
    label: string;
    error?: string;
    name: string;
    icon?: IconType
    InElement?: ReactNode
    small?: boolean
}


const TextFiled = forwardRef((props: TextFiledProps, ref: ForwardedRef<HTMLDivElement>) => {
    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);
    const [isError, setIsError] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null)

    const labelClassName = useMemo(() => {
        if (inputRef.current?.value) return "sr-only"
        else return `absolute z-10 font-extralight transition-all ease-in-out
        ${isFocus ? `bottom-[95%] ${props?.icon ? "left-[12%]" : "left-[2.4%]"} text-sm ${isError ? "dark:text-red-400 text-red-600" : "dark:text-secondary text-primary"}`
                : `text-base ${props?.icon ? "left-[20%]" : "left-[4%]"} bottom-[20%] text-gray-700 dark:text-gray-200`}`
    }, [inputRef.current, props?.icon, isError, isFocus])

    const handelChange = () => {
        setIsFocus(true)
        setIsError(false)
    }

    return (
        <div ref={ref} className={`flex flex-col justify-center items-center ${props.small ? "p-1 px-3" : "p-2 px-6"} w-full gap-2 ${props.className || ""}`}>
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {props.label}
                </label>
                {!props?.icon ? null : <props.icon className="text-secondary text-2xl font-bold" />}
                {!props?.InElement ? null : props.InElement}
                <input
                    {...props}
                    ref={inputRef}
                    className={`${props.small ? "p-1" : "p-2"} text-secondary bg-normal border h-fit rounded-sm w-full focus:border-none focus:outline-solid focus:outline-2 ${(isError && isFocus) ? "border-red-600 hover:border-red-800 dark:border-red-400 dark:hover:border-red-500 focus:outline-red-600 dark:focus:outline-red-400" : "dark:border-gray-300 dark:hover:border-white border-gray-700 hover:border-gray-900 focus:outline-secondary"}`}
                    id={Id}
                    name={props.name}
                    value={props.defaultValue}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(e) => handelChange()}
                />
            </div>
        </div>
    )
})

export default TextFiled;
