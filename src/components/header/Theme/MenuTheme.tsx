'use client'

import { useContext, useMemo } from 'react'
import { BsMoon, BsSun } from 'react-icons/bs'
import { MdLightMode, MdNightlight } from 'react-icons/md'
import secureLocalStorage from 'react-secure-storage'

import usePersistedState from '../../../hooks/usePersistedState'
import { isServerSide } from '../../../hooks/useUrqlClient'
import useWindowSize from '../../../hooks/useWindowSize'
import { ThemeContext, ThemeValue } from '../../context/ThemeContext'

export const MenuTheme = () => {
    const { theme, setTheme } = useContext(ThemeContext)
    const initialTheme = useMemo(
        () =>
            (isServerSide &&
                (secureLocalStorage.getItem('globalTheme') as ThemeValue)) ||
            theme,
        [theme]
    )
    const [, setPersistedTheme] = usePersistedState('theme', initialTheme)
    const { windowWidth } = useWindowSize()
    const isMobile = windowWidth && windowWidth < 900

    const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (theme === 'dark') {
            setTheme('light')
            setPersistedTheme('light')
        } else {
            setTheme('dark')
            setPersistedTheme('dark')
        }
    }

    return (
        <div className="menu-theme">
            <button onClick={toggleTheme} className="theme-btn">
                {theme === 'dark' ? (
                    <>{isMobile ? <BsSun /> : <MdLightMode size={24} />}</>
                ) : (
                    <>{isMobile ? <BsMoon /> : <MdNightlight size={22} />}</>
                )}
            </button>
        </div>
    )
}
