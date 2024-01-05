import { useEffect, useRef } from "react"

const useInfintieScroll = (callback: () => void) => {
    const ref = useRef<Element>(null)
    const observer = useRef<IntersectionObserver | null>(null)

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) callback()
        })
    }, [callback])

    useEffect(() => { if (ref.current) observer.current?.observe(ref.current) }, [ref])

    return ref
}


export default useInfintieScroll;
