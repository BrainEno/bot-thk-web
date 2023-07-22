import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BiLogIn, BiLogOut } from 'react-icons/bi'
import { HiOutlineMenu } from 'react-icons/hi'
import { isServer } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSubscription } from 'urql'

import {
    BlogPublishedSubscription,
    BlogPublishedSubscriptionVariables,
    UserFollowedSubscription,
} from '../../generated/gql/graphql'
import { BlogPublishedDocument } from '../../generated/gql/graphql'
import {
    GetFollowInfoDocument,
    GetFollowInfoQuery,
    GetFollowInfoQueryVariables,
    SubscriptionUserFollowedArgs,
    UserFollowedDocument,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'
import { deepParse } from '../../helpers/deepParse'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useNotificationStore } from '../../hooks/store/useNotificationStore'
import { useClickOutside } from '../../hooks/useClickOutside'
import useScrollDirection from '../../hooks/useScrollDirection'
import useWindowSize from '../../hooks/useWindowSize'
import Avatar from '../Avatar'
import MyBrand from '../MyBrand'

import { MenuNotification } from './Notification/MenuNotification'
import MenuSearch from './Search/MenuSearch'

const Header = () => {
    const append = useNotificationStore((state) => state.append)
    const userInLS = !isServer && localStorage.getItem('current-user')
    const prevName = deepParse(userInLS)?.state?.prevName || ''

    const { pathname, query } = useRouter()
    const user = useAuthStore((state) => state.user)

    const { data: followings } = useQuery<
        GetFollowInfoQuery,
        Error,
        NonNullable<GetFollowInfoQuery['getFollowInfo']>['followings']
    >(
        ['userGetFollowInfo'],
        fetcher<GetFollowInfoQuery, GetFollowInfoQueryVariables>(
            GetFollowInfoDocument,
            { username: user?.username }
        ),
        {
            enabled: !!(user && user.username),
            select: (data) => data.getFollowInfo!.followings,
        }
    )

    useSubscription<
        UserFollowedSubscription,
        Array<UserFollowedSubscription['userFollowed']>,
        SubscriptionUserFollowedArgs
    >(
        {
            query: UserFollowedDocument,
            variables: {
                name: user?.name || prevName || '',
            },
        },
        (prev = [], data) => {
            const { dateString, message, id, linkString } = data.userFollowed
            const type = id.split('_')[0]
            append({
                message,
                dateString,
                id,
                type,
                linkString,
                isViewed: false,
            })

            return [data.userFollowed, ...prev]
        }
    )

    useSubscription<
        BlogPublishedSubscription,
        Array<BlogPublishedSubscription['blogPublished']>,
        BlogPublishedSubscriptionVariables
    >(
        {
            query: BlogPublishedDocument,
            variables: {
                followingIds: followings?.map((f) => f._id.toString()) ?? [],
            },
        },
        (prev = [], data) => {
            const { dateString, message, id, linkString } = data.blogPublished
            const type = id.split('_')[0]
            append({
                message,
                dateString,
                id,
                type,
                linkString,
                isViewed: false,
            })

            return [data.blogPublished, ...prev]
        }
    )

    const [isAuth, setIsAuth] = useState(false)
    const { logOut } = useAuthStore()
    const router = useRouter()
    const [menuActive, setMenuActive] = useState(false)
    const { windowWidth } = useWindowSize()

    const isDesktop = useMemo(
        () => windowWidth && windowWidth > 900,
        [windowWidth]
    )

    const menuRef = useRef<HTMLDivElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)

    useClickOutside(btnRef, () => setMenuActive(false), menuRef)
    const scrollDirection = useScrollDirection()
    const showHeader = scrollDirection === 'down'

    const handleMenuClick = (e: MouseEvent) => {
        e.preventDefault()
        setMenuActive(!menuActive)
    }

    const handleLogOut = () => {
        logOut()
        router.replace('/logout', '/signin')
    }

    useEffect(() => {
        if (user) {
            setIsAuth(true)
        } else {
            setIsAuth(false)
        }
    }, [user])

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
                    <MenuSearch isAuth={isAuth} />
                    <MenuNotification isAuth={isAuth} />
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
