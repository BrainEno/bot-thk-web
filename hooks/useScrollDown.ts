import { useEffect, useState } from 'react'

const useScrollDown = (heightLimit = 1080) => {
    const [scrollDown, setScrollDown] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkScroll = () => {
                window.scrollY > heightLimit
                    ? setScrollDown(true)
                    : setScrollDown(false)
            }
            window.addEventListener('scroll', checkScroll)
            return () => {
                window.removeEventListener('scroll', checkScroll)
            }
        }
    }, [heightLimit])

    return scrollDown
}

export default useScrollDown
