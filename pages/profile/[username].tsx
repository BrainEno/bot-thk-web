import Head from 'next/head'
import { useState, useMemo } from 'react'
import { userPublicProfile } from '../../actions/user'
import { DOMAIN, APP_NAME } from '../../config'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Avatar from '../../components/profile/Avatar'
import MyBrand from '../../components/MyBrand'
import { Pagination } from 'antd'
import 'antd/dist/antd.css'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { IBlog, IUser } from '../../types'
import { ParsedUrlQuery } from 'node:querystring'

dayjs.extend(relativeTime)

interface IUserProfileProps {
    user: IUser
    blogs: IBlog[]
    query: ParsedUrlQuery
}

const UserProfile: React.FC<IUserProfileProps> = ({ user, blogs, query }) => {
    const head = () => (
        <Head>
            <title>
                {user.username} | {APP_NAME}
            </title>
            <meta name="description" content={`Blogs by ${user.username}`} />
            <link
                rel="canonical"
                href={`${DOMAIN}/profile/${query.username}`}
            />
            <meta
                property="og:title"
                content={`${user.username}| ${APP_NAME}`}
            />
            <meta
                property="og:description"
                content={`Blogs by ${user.username}`}
            />
            <meta property="og:type" content="webiste" />
            <meta
                property="og:url"
                content={`${DOMAIN}/profile/${query.username}`}
            />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/public/pic3.jpg`} />
            <meta
                property="og:image:secure_url"
                content={`${DOMAIN}/public/pic3.jpg`}
            />
            <meta property="og:image:type" content="image/jpg" />
        </Head>
    )

    const [pageSize, setPageSize] = useState(6)
    const [current, setCurrent] = useState(1)

    const paginatedBlogs = useMemo(() => {
        const lastIndex = pageSize * current
        const firstIndex = lastIndex - pageSize

        return blogs.slice(firstIndex, lastIndex)
    }, [current, pageSize, blogs])

    return (
        <>
            {head()}
            <div className="profile-container">
                <div className="profile-user">
                    <div className="avatar-container">
                        <a href={`/user/update`}>
                            <Avatar
                                title="编辑个人资料"
                                size={100}
                                radius={100}
                                src={`${process.env.NEXT_PUBLIC_API}/user/photo/${user.username}`}
                            />
                        </a>
                    </div>
                    <div className="profile-info">
                        <h3>{user.name}</h3>
                        {user.about && (
                            <p className="profile-about">
                                <b>{user.about}</b>
                            </p>
                        )}
                        <p>Joined {dayjs(user.createdAt, 'zh').fromNow()}</p>
                    </div>
                </div>

                <div className="profile-blogs">
                    <div className="blogs-info">
                        <div className="brand-container">
                            <MyBrand width={45} height={45} />
                        </div>
                        <h4 className="blogs-number">
                            {user.name}共发布了{blogs.length}篇文章
                        </h4>
                    </div>
                    <div className="blogs-container">
                        {blogs.length > 0
                            ? paginatedBlogs.map((b: IBlog, i: number) => (
                                  <a href={`/blogs/${b._id}`} key={i}>
                                      <div className="blog-card">
                                          <h5>{b.title}</h5>
                                          <span className="desc-text">
                                              By: {user.name} |{' '}
                                              {dayjs(b.createdAt, 'zh').format(
                                                  'MMMM,DD,YYYY'
                                              )}
                                          </span>
                                          <div>
                                              <p>
                                                  {b.description.replace(
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

                <div className="pagination-container">
                    <Pagination
                        simple
                        showSizeChanger
                        onShowSizeChange={setPageSize}
                        pageSize={pageSize}
                        total={blogs.length}
                        defaultCurrent={current}
                        onChange={setCurrent}
                    />
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({
    query,
}: GetServerSidePropsContext) => {
    const res = await userPublicProfile(query.username)
    const data = await res.json()
    return { props: { user: data.user, blogs: data.blogs, query } }
}

export default UserProfile
