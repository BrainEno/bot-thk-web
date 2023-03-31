import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MenuOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { useAuthStore } from '../../hooks/store/useAuthStore'
import useScrollDown from '../../hooks/useScrollDown'
import Avatar from '../Avatar'
import Search from '../blog/Search'
import MyBrand from '../MyBrand'

import ActiveLink from './ActiveLink'

const Header = () => {
    const { user, logOut } = useAuthStore()
    const isAuth = useMemo(() => !!user, [user])
    const router = useRouter()
    const scrollDown = useScrollDown()
    const [menuActive, setMenuActive] = useState(false)

    const menuRef = useRef<HTMLDivElement>(null)
    const btnRef = useRef<HTMLSpanElement>(null)

    const handleMenuClick = (e: MouseEvent) => {
        e.preventDefault()
        setMenuActive(!menuActive)
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (
            menuRef.current &&
            !menuRef.current!.contains(e.target as any) &&
            !btnRef.current!.contains(e.target as any)
        ) {
            setMenuActive(false)
        }
    }

    const handleLogOut = () => {
        logOut()
        router.push('/accout/login')
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [menuRef, menuActive])

    return (
        <nav
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
                        <ActiveLink activeClassName="active" href="/">
                            <a className="nav-link">首页</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink activeClassName="active" href="/blogs/">
                            <a className="nav-link">全部</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink activeClassName="active" href="/tags/novel">
                            <a className="nav-link">小说</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink
                            activeClassName="active"
                            href="/tags/poetry"
                        >
                            <a className="nav-link">诗歌</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink
                            activeClassName="active"
                            href="/tags/original"
                        >
                            <a className="nav-link">原创</a>
                        </ActiveLink>
                    </li>
                    <li>
                        <ActiveLink activeClassName="active" href="/tags/else">
                            <a className="nav-link">其他</a>
                        </ActiveLink>
                    </li>
                </ul>
                <Search />

                {isAuth ? (
                    <ul className="log-ul">
                        <li>
                            <div onClick={handleLogOut}>退出</div>
                        </li>
                    </ul>
                ) : (
                    <ul className="log-ul">
                        <li>
                            <ActiveLink activeClassName="active" href="/signin">
                                <a className="nav-link">登录</a>
                            </ActiveLink>
                        </li>
                        <li>
                            <ActiveLink activeClassName="active" href="/signup">
                                <a className="nav-link">注册</a>
                            </ActiveLink>
                        </li>
                    </ul>
                )}

                <div className="menu-avtar-container">
                    {isAuth && (
                        <Link
                            href={user!.role === '1' ? `/admin/` : `/user/`}
                            passHref
                        >
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
                    )}
                    {!!user && <p className="menu-avtar-name">{user.name}</p>}
                </div>
            </div>

            <MenuOutlined onClick={handleMenuClick as any} ref={btnRef} />
        </nav>
    )
}

export default Header
