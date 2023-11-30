import { useEffect, useRef, useState } from 'react'
import localforage from 'localforage'

type PersistedStateResult = [any, React.Dispatch<React.SetStateAction<string>>]

const usePersistedState = (
    name: string,
    defaultValue: any
): PersistedStateResult => {
    const [value, setValue] = useState(defaultValue)
    const nameRef = useRef(name)

    useEffect(() => {
        try {
            localforage.getItem(name).then((storedValue) => {
                if (storedValue !== null) {
                    setValue(storedValue)
                } else {
                    localforage.setItem(name, defaultValue).then(() => {
                        return
                    })
                }
            })
        } catch {
            setValue(defaultValue)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        try {
            localforage.setItem(nameRef.current, value).then(() => {
                return
            })
        } catch {
            return
        }
    }, [value])

    useEffect(() => {
        const lastName = nameRef.current
        if (name !== lastName) {
            try {
                localforage.setItem(name, value).then(() => {
                    nameRef.current = name
                    localforage.removeItem(lastName).then(() => {
                        return
                    })
                })
            } catch {
                return
            }
        } else {
            localforage.setItem(name, value).then(() => {
                return
            })
        }
    }, [name, value])

    return [value, setValue]
}

export default usePersistedState
