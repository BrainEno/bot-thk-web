import { useMemo, useState } from 'react'
import { FiUsers } from 'react-icons/fi'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'

import Avatar from '../../components/Avatar'
import { Pagination } from '../../components/Common/Pagination'
import MyBrand from '../../components/MyBrand'
import {
    GetUserInfoDocument,
    GetUserInfoQuery,
    GetUserInfoQueryVariables,
} from '../../generated/gql/graphql'
import {
    GetFollowInfoDocument,
    GetFollowInfoQuery,
    GetFollowInfoQueryVariables,
} from '../../generated/gql/graphql'
import {
    GetUserBlogsDocument,
    GetUserBlogsQuery,
    GetUserBlogsQueryVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'

const pageSize = 6

dayjs.extend(relativeTime)

interface IUserProfileProps {
    query: Record<string, string>
}

const UserProfile: React.FC<IUserProfileProps> = ({ query }) => {
    const { data: user } = useQuery<
        GetUserInfoQuery,
        Error,
        GetUserInfoQuery['getUserInfo']
    >(
        ['useGetUserInfo', query.username],
        fetcher<GetUserInfoQuery, GetUserInfoQueryVariables>(
            GetUserInfoDocument,
            { username: query.username }
        ),
        {
            enabled: !!(query && query.username),
            select: (data) => data.getUserInfo,
        }
    )

    const { data: blogs } = useQuery<
        GetUserBlogsQuery,
        Error,
        GetUserBlogsQuery['getUserBlogs']
    >(
        ['useGetUserBlogs', query.username],
        fetcher<GetUserBlogsQuery, GetUserBlogsQueryVariables>(
            GetUserBlogsDocument,
            { username: query.username }
        ),
        {
            enabled: !!(query && query.username),
            select: (data) => data.getUserBlogs,
        }
    )

    const { data: followInfo } = useQuery<
        GetFollowInfoQuery,
        Error,
        GetFollowInfoQuery['getFollowInfo']
    >(
        ['userGetFollowInfo'],
        fetcher<GetFollowInfoQuery, GetFollowInfoQueryVariables>(
            GetFollowInfoDocument,
            { username: query.username }
        ),
        {
            enabled: !!(query && query.username),
            select: (data) => data.getFollowInfo,
        }
    )

    const titleText = `${user?.username} | ${process.env.NEXT_PUBLIC_APP_NAME}`

    const head = () => (
        <Head>
            <title>{titleText}</title>
            <meta name="description" content={`Blogs by ${user?.username}`} />
            <link
                rel="canonical"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/profile/${query.username}`}
            />
            <meta
                property="og:title"
                content={`${user?.username}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta
                property="og:description"
                content={`Blogs by ${user?.username}`}
            />
            <meta property="og:type" content="webiste" />
            <meta
                property="og:url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/profile/${query.username}`}
            />
            <meta
                property="og:site_name"
                content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
            />

            <meta
                property="og:image"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/public/pic3.jpg`}
            />
            <meta
                property="og:image:secure_url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/public/pic3.jpg`}
            />
            <meta property="og:image:type" content="image/jpg" />
        </Head>
    )

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const [current, setCurrent] = useState(1)

    const paginatedBlogs = useMemo(() => {
        const lastIndex = pageSize * current
        const firstIndex = lastIndex - pageSize

        return blogs?.slice(firstIndex, lastIndex)
    }, [current, blogs])

    return (
        <>
            {user && head()}
            {user && (
                <div className="profile-container">
                    <div className="profile-user">
                        <div className="avatar-container">
                            <Avatar
                                title="头像"
                                size={100}
                                radius={100}
                                src={`${user.photo}`}
                            />
                        </div>
                        <div className="profile-info">
                            <h3>{user.name}</h3>
                            {followInfo && (
                                <div className="profile-followInfo">
                                    <span
                                        className="profile-about"
                                        style={{ textAlign: 'center' }}
                                    >
                                        <FiUsers />{' '}
                                        {`关注 ${followInfo.followings.length} `}{' '}
                                        ·
                                        {` 被关注 ${followInfo.followers.length}`}
                                    </span>
                                </div>
                            )}
                            {user.about && (
                                <p className="profile-about">
                                    <b>{user.about}</b>
                                </p>
                            )}
                            <p>
                                Joined {dayjs(user.createdAt, 'zh').fromNow()}
                            </p>
                        </div>
                    </div>

                    <div className="profile-blogs">
                        <div className="blogs-info">
                            <div className="brand-container">
                                <MyBrand width={45} height={45} />
                            </div>
                            <h4 className="blogs-number">
                                {user && user.name}共发布了
                                {blogs ? blogs?.length : 0}
                                篇文章
                            </h4>
                        </div>
                        <div className="blogs-container">
                            {blogs && blogs.length > 0 && paginatedBlogs
                                ? paginatedBlogs.map((b, i: number) => (
                                      <a href={`/blogs/${b.slug}`} key={i}>
                                          <div className="blog-card">
                                              <h5>{b.title}</h5>
                                              <span className="desc-text">
                                                  By: {user.name} |{' '}
                                                  {dayjs(
                                                      b.createdAt,
                                                      'zh'
                                                  ).format('MMMM,DD,YYYY')}
                                              </span>
                                              <div>
                                                  <p>
                                                      {b?.description?.replace(
                                                          /<[^>]+>/g,
                                                          ''
                                                      )}
                                                  </p>
                                              </div>
                                          </div>
                                      </a>
                                  ))
                                : ''}
                        </div>
                    </div>
                    {blogs && (
                        <Pagination
                            pageSize={pageSize}
                            total={blogs.length}
                            defaultCurrent={current}
                            onChange={setCurrent}
                        />
                    )}
                </div>
            )}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({
    query,
}: GetServerSidePropsContext) => {
    return { props: { query } }
}

export default UserProfile
