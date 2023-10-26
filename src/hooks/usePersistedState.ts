import { useEffect, useRef, useState } from 'react'
import secureLocalStorage from 'react-secure-storage'

type PersistedStateResult = [
    string,
    React.Dispatch<React.SetStateAction<string>>
]

const usePersistedState = (
    name: string,
    defaultValue: string
): PersistedStateResult => {
    const [value, setValue] = useState(defaultValue)
    const nameRef = useRef(name)

    useEffect(() => {
        try {
            const storedValue = secureLocalStorage.getItem(name)
            if (storedValue !== null) {
                setValue(JSON.stringify(storedValue))
            } else {
                secureLocalStorage.setItem(name, defaultValue)
            }
        } catch {
            setValue(defaultValue)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        try {
            secureLocalStorage.setItem(nameRef.current, value)
        } catch {
            return
        }
    }, [value])

    useEffect(() => {
        const lastName = nameRef.current
        if (name !== lastName) {
            try {
                secureLocalStorage.setItem(name, value)
                nameRef.current = name
                secureLocalStorage.removeItem(lastName)
            } catch {
                return
            }
        } else {
            secureLocalStorage.setItem(name, value)
        }
    }, [name, value])

    return [value, setValue]
}

export default usePersistedState
