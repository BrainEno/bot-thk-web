import React, { useEffect } from 'react'

export const useClickOutside = (
    ref: React.RefObject<HTMLElement>,
    callback: (e: any) => void,
    exceptRef?: React.RefObject<HTMLElement>
) => {
    const handleClick = (e: any) => {
        if (exceptRef?.current) {
            if (
                ref.current &&
                !ref.current.contains(e.target) &&
                !exceptRef.current.contains(e.target)
            ) {
                callback(e)
            }
        } else {
            if (ref.current && !ref.current.contains(e.target)) {
                callback(e)
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClick, true)
        return () => {
            document.removeEventListener('click', handleClick, true)
        }
    })
}
