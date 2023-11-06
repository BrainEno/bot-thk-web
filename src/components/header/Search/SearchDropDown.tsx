import { useRef } from 'react'
import { AiOutlineClockCircle, AiOutlineSearch } from 'react-icons/ai'
import { RxCross2 } from 'react-icons/rx'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { useSearchStore } from '../../../hooks/store/useSearchStore'
import { useClickOutside } from '../../../hooks/useClickOutside'

interface DropItemProps {
    title: string
    setSearchText: React.Dispatch<React.SetStateAction<string>>
}

export const DropItem = ({ title, setSearchText }: DropItemProps) => {
    const addSearch = useSearchStore((state) => state.add)
    const removeSearch = useSearchStore((state) => state.remove)

    const handleSearchClick = () => {
        setSearchText(title)
        addSearch(title)
    }

    return (
        <div className="drop-item">
            <div className="drop-item-title" onClick={handleSearchClick}>
                <AiOutlineClockCircle />
                <p className="title-text">{title}</p>
            </div>
            <div
                className="drop-item-remove"
                onClick={() => removeSearch(title)}
            >
                <RxCross2 />
            </div>
        </div>
    )
}

interface SearchDropdownProps {
    visible: boolean
    searchText: string
    menuBtnRef: React.MutableRefObject<HTMLButtonElement | null>
    setSearchText: React.Dispatch<React.SetStateAction<string>>
    close: () => void
}

export const SearchDropDown = ({
    visible,
    searchText,
    setSearchText,
    close,
    menuBtnRef,
}: SearchDropdownProps) => {
    const router = useRouter()
    const ref = useRef<null | HTMLDivElement>(null)

    const searchItems = useSearchStore((state) => state.searchItems)
    const addSearch = useSearchStore((state) => state.add)
    const clearAll = useSearchStore((state) => state.clear)

    const searchSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()

        if (searchText.trim() === '') return

        addSearch(searchText)
        close()
        router.push({
            pathname: '/search',
            query: { keyword: searchText },
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value)
    }

    useClickOutside(ref, close, menuBtnRef)

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="search-dropdown"
                    ref={ref}
                    initial={{ y: -10, z: -1, opacity: 0 }}
                    animate={{ y: 0, z: 5, opacity: 1 }}
                    exit={{ y: -10, z: -1, opacity: 0 }}
                >
                    <form onSubmit={searchSubmit} className="search-form">
                        <div
                            className={classNames('search-container', {
                                searched: false,
                            })}
                        >
                            <AiOutlineSearch
                                className="search-icon"
                                type="submit"
                                onClick={searchSubmit}
                            />
                            <input
                                type="text"
                                value={searchText}
                                className={'search-input'}
                                onChange={handleChange}
                                placeholder="搜索内容"
                            />
                            {searchText && (
                                <RxCross2
                                    className="reset-icon"
                                    type="button"
                                    onClick={() => setSearchText('')}
                                />
                            )}
                        </div>
                    </form>

                    <div className="search-items">
                        <div className="search-status">
                            <span>搜索记录</span>
                            {!!searchItems.length && (
                                <button onClick={() => clearAll()}>清空</button>
                            )}
                        </div>
                        {!!searchItems.length &&
                            searchItems.map((item) => (
                                <DropItem
                                    key={item.id}
                                    title={item.searchText}
                                    setSearchText={setSearchText}
                                />
                            ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
