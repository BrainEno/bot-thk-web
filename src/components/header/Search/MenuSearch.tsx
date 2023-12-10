import React, { useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import classNames from 'classnames'

import { SearchDropDown } from './SearchDropDown'

const MenuSearch = ({ isAuth }: { isAuth: boolean }) => {
    const [searchText, setSearchText] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const ref = useRef<null | HTMLButtonElement>(null)

    return (
        <div className={classNames('menu-search', { authed: isAuth })}>
            <button
                ref={ref}
                className={classNames('search-btn', {
                    clicked: showDropdown,
                })}
            >
                <AiOutlineSearch
                    size={24}
                    type="submit"
                    onClick={() => setShowDropdown(!showDropdown)}
                />
            </button>
            <SearchDropDown
                visible={showDropdown}
                searchText={searchText}
                setSearchText={setSearchText}
                close={() => {
                    setShowDropdown(false)
                }}
                menuBtnRef={ref}
            />
        </div>
    )
}

export default MenuSearch
