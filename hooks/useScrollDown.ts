import { useCallback, useEffect, useState } from 'react'

const useScrollDown = () => {
    const [scrollDown, setScrollDown] = useState(false)
    const handleScrolling = useCallback(() => {
        let currScrollPos
        let preScrollPos =
            document.body.scrollTop || document.documentElement.scrollTop

        window.addEventListener('scroll', () => {
            currScrollPos =
                document.body.scrollTop || document.documentElement.scrollTop

            if (currScrollPos - preScrollPos > 0) {
                setScrollDown(true)
            } else {
                setScrollDown(false)
            }
            preScrollPos = currScrollPos
        })
    }, [])

    useEffect(() => {
        handleScrolling()
        return () => {
            window.removeEventListener('scroll', handleScrolling)
        }
    }, [handleScrolling])

    return scrollDown
}

export default useScrollDown
