import { useCallback, useEffect, useState } from 'react'

interface UseIsValidSrcParams {
    source: string
    onLoad?: () => void
    onError?: () => void
}

const useIsValidSrc = ({ source, onLoad, onError }: UseIsValidSrcParams) => {
    const [validSrc, setValidSrc] = useState(false)

    const isValidSrc = useCallback(() => {
        let hasChangeURL = false
        const image = new Image()
        image.src = source

        image.addEventListener('load', () => {
            if (!hasChangeURL) {
                setValidSrc(true)
                onLoad?.()
            }
        })

        image.addEventListener('error', () => {
            if (!hasChangeURL) {
                setValidSrc(false)
                onError?.()
            }
        })

        return () => {
            hasChangeURL = false
        }
    }, [onError, onLoad, source])

    useEffect(() => {
        isValidSrc()
    }, [isValidSrc])

    return validSrc
}

export default useIsValidSrc
