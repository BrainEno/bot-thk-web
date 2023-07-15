import React, { useEffect } from 'react'

export const useClickOutside = (
    ref: React.RefObject<HTMLElement>,
    callback: () => void,
    exceptRef?: React.RefObject<HTMLElement>
) => {
    const handleClick = (e: any) => {
        if (exceptRef?.current) {
            if (
                ref.current &&
                !ref.current.contains(e.target) &&
                !exceptRef.current.contains(e.target)
            ) {
                callback()
            }
        } else {
            if (ref.current && ref.current.contains(e.target)) {
                callback()
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClick,true)
        return () => {
            document.removeEventListener('click', handleClick,true)
        }
    })
}
