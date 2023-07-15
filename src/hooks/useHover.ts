import { useEffect, useState } from 'react'
import { RefObject } from 'preact'

const useHover = <T extends HTMLElement = HTMLElement>(
    eleRef: RefObject<T>
) => {
    const [hovered, setHovered] = useState(false)

    const enterHandler = () => setHovered(true)
    const leaveHandler = () => setHovered(false)

    useEffect(() => {
        const ele = eleRef.current
        if (ele !== null && typeof window !== 'undefined') {
            ele.addEventListener('mouseenter', enterHandler)
            ele.addEventListener('mouseleave', leaveHandler)
            return () => {
                ele?.removeEventListener('mouseenter', enterHandler)
                ele?.removeEventListener('mouseleave', leaveHandler)
            }
        }
    }, [eleRef])

    return hovered
}

export default useHover
