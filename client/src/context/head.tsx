import { Dispatch, ReactElement, createContext, useContext,
    useReducer } from 'react';

interface IHead {
    title: string;
    meta: {
        name: string;
        content: string;
    }[];
}

interface IHeadAction {
    payload: {
        title: string;
        meta: {
            name: string;
            content: string;
        }[];
    }
}

const modalInit: IHead = {
    title: "",
    meta: [],
}

const ModalContext = createContext<IHead>(modalInit);
const ModalDispatchContext = createContext<Dispatch<IHeadAction>>(() => null);

export function useHead(): IHead {
    return useContext(ModalContext);
}

export function useHeadDispatch() {
    return useContext(ModalDispatchContext);
}

function ModalReducer(modal: IHead, action: IHeadAction): IHead {
    modal = action.payload;
    const eles = document.getElementsByTagName("title")
    if (eles.length < 1) {
        const ele = document.createElement("title")
        ele.textContent = modal.title;
        document.head.appendChild(ele)
    } else {
        eles[0].textContent = modal.title;
    }

    for (let i = 0; i < modal.meta.length; i++) {
        const meta = modal.meta[i]
        const ele = document.getElementsByTagName("meta").namedItem(meta.name)
        if (ele === null) {
            const eleX = document.createElement("meta")
            eleX.setAttribute("name", meta.name)
            eleX.setAttribute("content", meta.content)
            document.head.appendChild(eleX)
        } else {
            ele.setAttribute("content", meta.content)
        }
    }
    return modal;
}

export default function HeadProvider({ children }: { children: ReactElement }) {
    const [Modal, dispatchModal] = useReducer(ModalReducer, modalInit);

    return (
        <ModalContext.Provider value={Modal}>
            <ModalDispatchContext.Provider value={dispatchModal}>
                {children}
            </ModalDispatchContext.Provider>
        </ModalContext.Provider>
    );
}

