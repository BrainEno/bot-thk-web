import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BiLogIn, BiLogOut } from 'react-icons/bi'
import { HiOutlineMenu } from 'react-icons/hi'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'

import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useBlogPulished } from '../../hooks/subscriptions/useBlogPublished'
import { useConversationCreated } from '../../hooks/subscriptions/useConversationCreated'
import { useConversationDeleted } from '../../hooks/subscriptions/useConversationDeleted'
import { useUserFollowed } from '../../hooks/subscriptions/useUserFollowed'
import useAuth from '../../hooks/useAuth'
import { useClickOutside } from '../../hooks/useClickOutside'
import useScrollDirection from '../../hooks/useScrollDirection'
import useWindowSize from '../../hooks/useWindowSize'
import MyBrand from '../common/MyBrand'

import { MenuNotification } from './Notification/MenuNotification'
import MenuSearch from './Search/MenuSearch'
import { MenuTheme } from './Theme/MenuTheme'
import dynamic from 'next/dynamic'

const Avatar = dynamic(() => import('../common/Avatar'), { ssr: false })

const Header = () => {
    const logOut = useAuthStore((state) => state.logOut)
    const router = useRouter()
    const isAuth = useAuth(true)
    const { pathname, query } = useRouter()
    const session = useSession()
    const user = session.data?.user

    const [menuActive, setMenuActive] = useState(false)
    const { windowWidth } = useWindowSize()

    const isDesktop = useMemo(
        () => windowWidth && windowWidth > 900,
        [windowWidth]
    )

    const menuRef = useRef<HTMLDivElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)

    const scrollDirection = useScrollDirection()
    const showHeader = scrollDirection === 'down'
    /**
     * Notifiction Subscriptions
     */
    useBlogPulished(user)
    useUserFollowed(user)

    /**
     * Conversation Subscriptions
     */

    useConversationCreated(isAuth)
    useConversationDeleted(isAuth)

    /**
     * Handle mobile menu clickOutside
     */
    useClickOutside(
        btnRef,
        (e) => {
            if (menuActive) e.preventDefault()
            setMenuActive(false)
        },
        menuRef
    )

    const handleMenuClick = (e: MouseEvent) => {
        e.preventDefault()
        setMenuActive(!menuActive)
    }

    const handleLogOut = () => {
        logOut().then(() => {
            session.data = null
            router.push({ pathname: '/signin' })
        })
    }

    useEffect(() => {
        const closeMenu = () => setMenuActive(false)

        if (!isDesktop) {
            router.events.on('routeChangeComplete', closeMenu)
        }

        return () => {
            router.events.off('routeChangeComplete', closeMenu)
        }
    })

    return (
        <>
            <div
                className="site-navigation"
                style={
                    !menuActive && showHeader
                        ? {
                              opacity: '0',
                              transform: 'translate(0,-65px)',
                          }
                        : { opacity: '1', transform: 'translate(0,0px)' }
                }
            >
                <div className="menu-title">
                    <MyBrand
                        width={45}
                        height={45}
                        fontSize={'24px'}
                        cursor="pointer"
                        toHome
                    />
                </div>

                <button
                    className="menu-btn"
                    onClick={handleMenuClick as any}
                    ref={btnRef}
                >
                    <HiOutlineMenu />
                </button>

                <div
                    className={`menu-content-container ${
                        menuActive && 'active'
                    }`}
                    onMouseLeave={() => setMenuActive(false)}
                    ref={menuRef}
                >
                    <ul className={classNames('nav', { 'no-user': !user })}>
                        <li>
                            <Link
                                className={classNames('nav-link', {
                                    active: pathname === '/',
                                })}
                                href={{ pathname: '/' }}
                            >
                                首页
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={classNames('nav-link', {
                                    active: pathname === '/blogs',
                                })}
                                href={{ pathname: '/blogs' }}
                            >
                                全部
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={classNames('nav-link', {
                                    active: query?.slug === 'novel',
                                })}
                                href={{
                                    pathname: '/tags/[slug]',
                                    query: { slug: 'novel' },
                                }}
                            >
                                小说
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={classNames('nav-link', {
                                    active: query.slug === 'poetry',
                                })}
                                href={{
                                    pathname: '/tags/[slug]',
                                    query: { slug: 'poetry' },
                                }}
                            >
                                诗歌
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={classNames('nav-link', {
                                    active: query.slug === 'original',
                                })}
                                href={{
                                    pathname: '/tags/[slug]',
                                    query: { slug: 'original' },
                                }}
                            >
                                原创
                            </Link>
                        </li>
                        <li>
                            <Link
                                className={classNames('nav-link', {
                                    active: query.slug === 'else',
                                })}
                                href={{
                                    pathname: '/tags/[slug]',
                                    query: { slug: 'else' },
                                }}
                            >
                                其他
                            </Link>
                        </li>
                    </ul>
                    <MenuTheme />
                    <MenuSearch isAuth={isAuth} />
                    <MenuNotification isAuth={isAuth} />
                    {isAuth && (
                        <div className="menu-avtar-container">
                            <Link href="/dashboard" passHref>
                                <div className="my-avatar">
                                    {user && (
                                        <Avatar
                                            char={user.name
                                                ?.slice(0, 1)
                                                .toUpperCase()}
                                            title="个人主页"
                                            size={38}
                                            radius={38}
                                            src={`${user?.image ?? ''}`}
                                        />
                                    )}
                                </div>
                            </Link>

                            {!!user && (
                                <p className="menu-avatar-name">{user.name}</p>
                            )}
                        </div>
                    )}
                    <div className="log-container">
                        {isAuth ? (
                            <div className="log-ul">
                                <div
                                    onClick={handleLogOut}
                                    className="nav-link"
                                >
                                    <BiLogOut size={25} />
                                    退出
                                </div>
                            </div>
                        ) : (
                            <div className="log-ul">
                                <div>
                                    <Link className="nav-link" href="/signin">
                                        <BiLogIn size={25} />
                                        <div>登录</div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header
