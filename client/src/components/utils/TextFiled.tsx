import { ForwardedRef, HTMLProps, ReactNode, forwardRef, useId, useMemo, useState } from "react";
import { IconType } from "react-icons";

interface TextFiledProps extends HTMLProps<HTMLInputElement> {
    label: string;
    error?: string | null;
    name: string;
    icon?: IconType
    InElement?: ReactNode
    small?: boolean
    value: string;
    setValue: (x: string) => void
}


const TextFiled = forwardRef(({ label, error, name, icon: Icons, InElement, small, className, ...inputProps }: TextFiledProps, ref: ForwardedRef<HTMLDivElement>) => {
    const Id = useId();
    const [isFocus, setIsFocus] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isValue, setIsValue] = useState(false);

    const labelClassName = useMemo(() => {
        if (isValue) return "sr-only"
        else return `absolute z-10 font-extralight transition-all ease-in-out
        ${isFocus ? `bottom-[95%] ${Icons ? "left-[12%]" : "left-[2.4%]"} text-sm ${isError ? "dark:text-red-400 text-red-600" : "dark:text-secondary text-primary"}`
                : `text-base ${Icons ? "left-[20%]" : "left-[4%]"} bottom-[20%] text-gray-700 dark:text-gray-200`}`
    }, [isValue, Icons, isError, isFocus])

    const handelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsValue(e.target.value.length > 0)
        inputProps.setValue(e.target.value)
        setIsFocus(true)
        setIsError(false)
    }

    return (
        <div ref={ref} className={`flex flex-col justify-center items-center ${small ? "p-1 px-3" : "p-2 px-6"} w-full gap-2 ${className || ""}`}>
            <div className="flex flex-row gap-2 w-full justify-center items-center relative">
                <label
                    htmlFor={Id}
                    className={labelClassName}>
                    {label}
                </label>
                {!Icons ? null : <Icons className="text-secondary text-2xl font-bold absolute left-1" />}
                {!InElement ? null : InElement}
                <input
                    {...inputProps}
                    onChange={handelChange}
                    className={`${small ? "p-1" : "p-2"} ${InElement ? "pr-8" : ""} pl-8 w-60 text-secondary bg-normal border h-fit rounded-sm focus:border-none focus:outline-solid focus:outline-2 ${error ? "focus:border-red-600 focus:hover:border-red-800 focus:dark:border-red-400 focus:dark:hover:border-red-500 focus:outline-red-600 dark:focus:outline-red-400" : "focus:dark:border-gray-300 focus:dark:hover:border-white focus:border-gray-700 focus:hover:border-gray-900 focus:outline-secondary"}`}
                    id={Id}
                    value={inputProps.value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    name={name}
                />
            </div>
            {error ? <p className="inline text-base text-red-600 w-full">{error}</p> : null}
        </div>
    )
})

export default TextFiled;
