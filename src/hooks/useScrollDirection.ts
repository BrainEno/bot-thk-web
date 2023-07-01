import { useCallback, useEffect, useRef, useState } from 'react'

const useScrollDirection = () => {
    const curScrollY = useRef(0)
    const prevScrollY = useRef(0)

    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')

    const handleScroll = useCallback(() => {
        const getScrollY = () =>
            (
                document.documentElement ||
                document.body.parentNode ||
                document.body
            ).scrollTop
            
        curScrollY.current = getScrollY()
        const direction =
            curScrollY.current > prevScrollY.current ? 'down' : 'up'
        if (
            direction !== scrollDirection &&
            Math.abs(curScrollY.current - prevScrollY.current) > 5
        ) {
            setScrollDirection(direction)
        }
        prevScrollY.current = curScrollY.current > 0 ? curScrollY.current : 0
    }, [scrollDirection])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll)
            return () => {
                window.removeEventListener('scroll', handleScroll)
            }
        }
    }, [handleScroll])

    return scrollDirection
}

export default useScrollDirection
