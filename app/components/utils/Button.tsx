import { HTMLProps, ReactNode } from 'react';
import CircleProgress from './CircleProgress'

type Size = "sm" | "md" | "lg";

function getSize(size?: Size) {
    let sizeClass = "";

    switch (size) {
        case "sm":
            sizeClass = "text-sm px-1 py-0.5";
            break;
        case "md":
            sizeClass = "text-base px-2 py-1";
            break;
        case "lg":
            sizeClass = "text-lg px-3 py-1.5";
            break;
        default:
            sizeClass = "text-base px-2 p-1"
            break;
    }

    return sizeClass;
}


type ButtonElement = HTMLProps<HTMLButtonElement> & { type?: "button" | "submit" | "reset" };

interface IButtonProps extends Omit<ButtonElement, 'size'> {
    children?: ReactNode;
    isLoading?: boolean;
    size?: Size
}

const Button = ({ children, isLoading, size, ...props }: IButtonProps) => {
    return (
        <button
            {...props}
            disabled={isLoading}
            className={`${getSize(size)}
                bg-gray-300 dark:bg-gray-700 ${isLoading ? "cursor-wait" : "cursor-pointer"}
                dark:bg-secondary bg-primary ${props.className || ""} rounded-md border-0 outline-none
                whitespace-nowrap font-bold dark:text-primary text-secondary dark:hover:text-black
                hover:text-white text-center transition-all ease-in-out shadow-md hover:shadow-lg
                dark:shadow-secondary/40 dark:hover:border-gray-400 hover:border-gray-600 w-fit h-fit
            `}>

            {isLoading ? <CircleProgress size="xm" /> : children}
        </button>
    )
}

export default Button;
