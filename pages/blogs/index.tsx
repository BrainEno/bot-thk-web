import { useCallback, useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import Head from 'next/head'
import { NextRouter, withRouter } from 'next/router'

import PostInfo from '../../components/blog/PostInfo'
import { getSdkWithHooks, ListBlogsWithCatTagQuery } from '../../gql/sdk'
import { gqlClient } from '../../graphql/gqlClient'

const sdk = getSdkWithHooks(gqlClient)

type BlogsProps = {
    router: NextRouter
    posts: ListBlogsWithCatTagQuery['listBlogsWithCatTag']
    count: number
}

const Blogs = ({ router, posts, count }: BlogsProps) => {
    const [observedPost, setObservedPost] = useState('')
    const [pageIndex, setPageIndex] = useState(0)

    const { data, error, isValidating } = sdk.useListBlogsWithCatTag(
        '/blogs/all',
        {},
        { refreshInterval: 60 }
    )

    console.log('data', data)

    const isInitialLoading = !data && !error

    const observeElement = useCallback(
        (element: HTMLElement | null) => {
            if (!element) return
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting === true) {
                        setPageIndex(pageIndex + 1)
                        observer.unobserve(element)
                    }
                },
                { threshold: 1 }
            )
            observer.observe(element)
        },
        [pageIndex, setPageIndex]
    )

    useEffect(() => {
        if (!posts) return

        const id = (posts as { [key: number]: any })[count - 1]._id

        if (id !== observedPost) {
            setObservedPost(id)
            observeElement(document.getElementById(id))
        }
    }, [posts, observedPost, observeElement, count])

    const head = () => (
        <Head>
            <title>All Blogs | {process.env.NEXT_PUBLIC_APP_NAME}</title>
            <meta
                name="description"
                content="Cruel Literature,novels,poemes,and else"
            />
            <link
                rel="canonical"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}${router.pathname}`}
            />
            <meta
                property="og:title"
                content={`cruel literature | BOT THINK`}
            />
            <meta
                property="og:description"
                content="Cruel Literature,novels,poemes,and else"
            />
            <meta property="og:type" content="webiste" />
            <meta
                property="og:url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}${router.pathname}`}
            />
            <meta
                property="og:site_name"
                content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
        </Head>
    )

    return (
        <>
            {/* {head()} */}
            <main className="allBlogs">
                <section className="all-blogs-container">
                    <h1>All Blogs</h1>
                    <div className="all-blog-cards">
                        {isInitialLoading ? (
                            <div className="loading-container">
                                <LoadingOutlined />
                            </div>
                        ) : (
                            <section className="post-grid">
                                {posts?.map((post: any) => (
                                    <PostInfo post={post} key={post._id} />
                                ))}
                                {isValidating && posts.length > 0 && (
                                    <p className="loading-text">正在加载</p>
                                )}
                            </section>
                        )}
                    </div>
                </section>
            </main>
        </>
    )
}

export default withRouter(Blogs)

export const getServerSideProps = async () => {
    const { listBlogsWithCatTag:posts } = await sdk.ListBlogsWithCatTag()
  
    const count = posts.length
    return {
        props: { posts, count },
    }
}
