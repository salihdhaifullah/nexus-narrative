import { BiListOl } from "react-icons/bi";
import { useCallback, useEffect, useRef } from "react";
import { getCurrentLine, setRange, useTextarea } from "./util";


const OrderedList = () => {
    const isOrderedListMode = useRef(false);
    const orderedListCount = useRef(1);
    const textarea = useTextarea();

    const resetState = () => {
        isOrderedListMode.current = false;
        orderedListCount.current = 1;
    }

    const addItem = useCallback(() => {
        const text = textarea.value;
        const start = textarea.selectionStart;
        const currentLine = getCurrentLine(start, text);
        const char = Number(currentLine.split(".")[0][0]);

        if ((Number.isNaN(char) || !Number.isInteger(char)) && isOrderedListMode.current) resetState();

        const inner = `${currentLine.length === 0 ? "" : "\n"}${orderedListCount.current}. `;

        setRange(textarea, start);
        document.execCommand("insertText", false, inner);
        setRange(textarea, start + inner.length);

        orderedListCount.current++;
        isOrderedListMode.current = true;
    }, [textarea])


    const enterOrderedListMode = () => {
        addItem();
    }

    const undo = useCallback(() => {
        const start = textarea.selectionStart;
        setRange(textarea, start);
        document.execCommand("undo");
    }, [textarea])

    const keydownListener = useCallback((e: KeyboardEvent) => {
        if (e.key !== "Enter" || !isOrderedListMode.current) return;

        e.preventDefault();
        const text = textarea.value;
        const start = textarea.selectionStart;
        const currentLineParts = getCurrentLine(start, text).split(".");

        const char = Number(currentLineParts[0][0]);

        if (Number.isNaN(char) || !Number.isInteger(char)) {
            resetState();
            undo();
            return;
        }

        if (currentLineParts[1] && currentLineParts[1].length > 0) {
            addItem();
        }
        else {
            resetState();
            undo();
        }
    }, [addItem, textarea.selectionStart, textarea.value, undo]);


    useEffect(() => {
        textarea.addEventListener("keydown", keydownListener);
        return () => textarea.removeEventListener("keydown", keydownListener);
    }, [keydownListener, textarea]);

    return (
        <button title="Ordered list" className="flex justify-center items-center" onClick={() => enterOrderedListMode()}>
            <BiListOl className="text-gray-700 dark:text-gray-300 dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-primary dark:hover:text-secondary text-xl rounded-sm cursor-pointer" />
        </button>
    );
};

export default OrderedList;
