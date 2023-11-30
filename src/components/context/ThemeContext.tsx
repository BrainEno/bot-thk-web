'use client'

import React, { ReactNode, useContext, useEffect, useState } from 'react'
import classNames from 'classnames'

import usePersistedState from '../../hooks/usePersistedState'
import { isServerSide } from '../../hooks/useUrqlClient'

export type ThemeValue = 'light' | 'dark'

export type ThemeOption = {
    title: string
    value: ThemeValue
}

export const themeOptions: ThemeOption[] = [
    { title: '浅色', value: 'light' },
    { title: '深色', value: 'dark' },
]

export type Theme = {
    theme: ThemeValue
    setTheme: React.Dispatch<React.SetStateAction<ThemeValue>>
}

export const initialTheme: Theme = {
    theme: 'dark',
    setTheme: () => {
        return
    },
}

export const ThemeContext = React.createContext(initialTheme)

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { theme } = useContext(ThemeContext)
    const [globalTheme] = usePersistedState('globalTheme', theme) as [
        ThemeValue,
        React.Dispatch<React.SetStateAction<ThemeValue>>,
    ]
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const [innerTheme, setInnerTheme] = useState(globalTheme || theme)

    useEffect(() => {
        if (globalTheme && !isServerSide) {
            setInnerTheme(globalTheme)
        }
    }, [theme, globalTheme])

    return (
        <ThemeContext.Provider
            value={{ theme: innerTheme, setTheme: setInnerTheme }}
        >
            {isClient && (
                <div
                    className={classNames('theme-provider', {
                        'theme-dark': innerTheme === 'dark',
                        'theme-light': innerTheme === 'light',
                    })}
                >
                    {children}
                </div>
            )}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider
