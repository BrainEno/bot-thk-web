'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { showAlert } from '../components/common/Alert'
import { DEFAULT_AVATAR } from '../components/dashboard/FollowInfoList'
import {
    PopulatedCardBlog,
    SearchBlogsDocument,
    SearchBlogsQuery,
    SearchBlogsQueryVariables,
    SearchUsersDocument,
    SearchUsersQuery,
    SearchUsersQueryVariables,
} from '../generated/graphql-request'
import { fetcher } from '../graphql/gqlClient'
import { useAuthStore } from '../hooks/store/useAuthStore'
import { useSearchStore } from '../hooks/store/useSearchStore'
import { useClient } from '../hooks/useClient'
import useScrollDirection from '../hooks/useScrollDirection'
import { ServerSideTranslations } from '../types'

const BlogCard = dynamic(
    import('../components/search/BlogCard').then((mod) => mod.default),
    {
        ssr: false,
    }
)
const UserCard = dynamic(import('../components/search/UserCard'), {
    ssr: false,
})

export const DEFAULT_IMAGE = process.env.NEXT_PUBLIC_DEFAULT_IMAGE as string
export const DEFAULT_ABOUT = 'Nothing here...'

const SearchResult = () => {
    const searchParams = useSearchParams()
    const keyword = searchParams.get('keyword')
    const [viewType, setViewType] = useState<'BLOG' | 'USER'>('BLOG')
    const searchItems = useSearchStore((state) => state.searchItems)
    const user = useAuthStore((state) => state.user)
    const [warn, setWarn] = useState('')
    const addSearchItem = useSearchStore((state) => state.add)
    const router = useRouter()
    const scrollDirection = useScrollDirection()
    const isClient = useClient()

    const { data: blogs } = useQuery<
        SearchBlogsQuery,
        Error,
        SearchBlogsQuery['searchBlogs']
    >({
        queryKey: ['searchBlogs', keyword],
        queryFn: fetcher<SearchBlogsQuery, SearchBlogsQueryVariables>(
            SearchBlogsDocument,
            { query: keyword! }
        ),
        enabled: !!keyword,
        select: (data) => data.searchBlogs,
    })

    // console.log(blogs)

    const { data: users } = useQuery<
        SearchUsersQuery,
        Error,
        SearchUsersQuery['searchUsers']
    >({
        queryKey: ['searchUsers', keyword],
        queryFn: fetcher<SearchUsersQuery, SearchUsersQueryVariables>(
            SearchUsersDocument,
            { name: keyword! }
        ),
        enabled: !!keyword,
        select: (data) => data.searchUsers,
    })

    const handleSearch = (keyword: string) => {
        addSearchItem(keyword)
        router.push({ pathname: '/search', query: { keyword } })
    }

    return (
        <div className="search-page">
            {warn && showAlert(warn, 'warn')}
            <div className="search-container">
                <div className="search-header">
                    <span className="keyword">"{keyword}"</span> 的搜索结果
                </div>
                <div className="search-nav">
                    <div
                        className={classNames('search-nav-item', {
                            selected: viewType === 'BLOG',
                        })}
                        onClick={() => setViewType('BLOG')}
                    >
                        相关文章{' ' + blogs?.length || 0}
                    </div>
                    <div
                        className={classNames('search-nav-item', {
                            selected: viewType === 'USER',
                        })}
                        onClick={() => setViewType('USER')}
                    >
                        相关用户{' ' + users?.length || 0}
                    </div>
                </div>

                {viewType === 'BLOG' &&
                    !!blogs &&
                    blogs.map((b) => (
                        <BlogCard key={b.slug} blog={b as PopulatedCardBlog} />
                    ))}
                {viewType === 'USER' &&
                    !!users &&
                    users.map((u) => (
                        <UserCard
                            searchedUserId={u._id}
                            key={u.username}
                            photo={u.photo || DEFAULT_AVATAR}
                            name={u.name}
                            about={u.about || DEFAULT_ABOUT}
                            username={u.username}
                            curUser={user}
                            setWarn={setWarn}
                        />
                    ))}
            </div>
            <div
                className="recent-search"
                style={{
                    transform:
                        scrollDirection === 'down'
                            ? 'translateY(-100px)'
                            : 'translateY(0)',
                }}
            >
                <div>最近搜索</div>
                <div className="search-records">
                    {isClient && searchItems ? (
                        searchItems.map((s) => (
                            <div
                                className="search-record"
                                key={s.id}
                                onClick={() => handleSearch(s.searchText)}
                            >
                                {s.searchText}
                            </div>
                        ))
                    ) : (
                        <div>暂无搜索记录</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchResult

export const getServerSideProps: GetServerSideProps<
    ServerSideTranslations
> = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    }
}
