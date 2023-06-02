import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineMenu } from 'react-icons/hi'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useClickOutside } from '../../hooks/useClickOutside'
import useScrollDown from '../../hooks/useScrollDown'
import Avatar from '../Avatar'
import Search from '../blog/Search'
import MyBrand from '../MyBrand'

const Header = () => {
    const { pathname, query } = useRouter()
    const user = useAuthStore((state) => state.user)
    const [isAuth, setIsAuth] = useState(false)
    const { logOut } = useAuthStore()
    const router = useRouter()
    const scrollDown = useScrollDown()
    const [menuActive, setMenuActive] = useState(false)

    const menuRef = useRef<HTMLDivElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)

    useClickOutside(btnRef, () => setMenuActive(false), menuRef)

    const handleMenuClick = (e: MouseEvent) => {
        e.preventDefault()
        setMenuActive(!menuActive)
    }

    const handleLogOut = () => {
        logOut()
        router.push('/signin')
    }

    useEffect(() => {
        if (user) {
            setIsAuth(true)
        } else {
            setIsAuth(false)
        }
    }, [user])

    return (
        <div
            className="site-navigation"
            style={
                scrollDown
                    ? { opacity: '0', top: '-65px' }
                    : { opacity: '1', top: '0px' }
            }
        >
            <span className="menu-title">
                <MyBrand
                    width={45}
                    height={45}
                    fontSize={'24px'}
                    cursor="pointer"
                />
            </span>
            <div
                className={`menu-content-container ${menuActive && 'active'}`}
                onMouseLeave={() => setMenuActive(false)}
                ref={menuRef}
            >
                <ul className="nav">
                    <li>
                        <Link
                            className={classNames('nav-link', {
                                active: pathname === '/',
                            })}
                            href="/"
                        >
                            首页
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={classNames('nav-link', {
                                active: pathname === '/blogs',
                            })}
                            href="/blogs"
                        >
                            全部
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={classNames('nav-link', {
                                active: query?.slug === 'novel',
                            })}
                            href="/tags/novel"
                        >
                            小说
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={classNames('nav-link', {
                                active: query.slug === 'poetry',
                            })}
                            href="/tags/poetry"
                        >
                            诗歌
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={classNames('nav-link', {
                                active: query.slug === 'original',
                            })}
                            href="/tags/original"
                        >
                            原创
                        </Link>
                    </li>
                    <li>
                        <Link
                            className={classNames('nav-link', {
                                active: query.slug === 'else',
                            })}
                            href="/tags/else"
                        >
                            其他
                        </Link>
                    </li>
                </ul>
                <Search />
                <div>
                    {isAuth ? (
                        <div className="log-ul">
                            <div onClick={handleLogOut}>退出</div>
                        </div>
                    ) : (
                        <div className="log-ul">
                            <div>
                                <Link className="nav-link" href="/signin">
                                    登录
                                </Link>
                                <Link className="nav-link" href="/signup">
                                    注册
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
                {isAuth && (
                    <div className="menu-avtar-container">
                        <Link href="/dashboard" passHref>
                            <div className="my-avatar">
                                {!!user && (
                                    <Avatar
                                        char={user.name
                                            .slice(0, 1)
                                            .toUpperCase()}
                                        title="个人主页"
                                        size={38}
                                        radius={38}
                                        src={`${user?.photo ?? ''}`}
                                    />
                                )}
                            </div>
                        </Link>

                        {!!user && (
                            <p className="menu-avtar-name">{user.name}</p>
                        )}
                    </div>
                )}
            </div>
            <button
                className="menu-btn"
                onClick={handleMenuClick as any}
                ref={btnRef}
            >
                <HiOutlineMenu />
            </button>
        </div>
    )
}

export default Header
