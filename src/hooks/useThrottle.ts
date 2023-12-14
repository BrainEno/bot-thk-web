import { useEffect, useRef, useState } from 'react'
const useThrottle = <T, U extends any[]>(
    fn: (...args: U) => T,
    ms = 200,
    args: U
) => {
    const [state, setState] = useState<T | null>(null)
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const nextArgs = useRef<U>()

    useEffect(() => {
        if (!timeout.current) {
            setState(fn(...args))
            const timeoutCallback = () => {
                if (nextArgs.current) {
                    setState(fn(...nextArgs.current))
                    nextArgs.current = undefined
                    timeout.current = setTimeout(timeoutCallback, ms)
                } else {
                    timeout.current = undefined
                }
            }
            timeout.current = setTimeout(timeoutCallback, ms)
        } else {
            nextArgs.current = args
        }

        return () => {
            timeout.current && clearTimeout(timeout.current)
        }
    }, [args, fn, ms])

    return state
}

export default useThrottle
