import { NextRouter, withRouter } from 'next/router'
import Head from 'next/head'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import PostCard from '../../components/blog/PostCard'
import useSWRInfinite from 'swr/infinite'

const Blogs = ({ router }: { router: NextRouter }) => {
    const getKey = (index: number) => {
        return `${process.env.NEXT_PUBLIC_API}/blogs-tags?page=${index}&count=9`
    }
    const [observedPost, setObservedPost] = useState('')
    const { data, error, size, setSize, isValidating } = useSWRInfinite(
        getKey,
        (url: string) => fetch(url).then((r) => r.json())
    )

    const isInitialLoading = !data && !error

    const posts: any = useMemo(() => (data ? [].concat(...data) : []), [data])

    const observeElement = useCallback(
        (element: HTMLElement | null) => {
            if (!element) return
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting === true) {
                        setSize(size + 1)
                        observer.unobserve(element)
                    }
                },
                { threshold: 1 }
            )
            observer.observe(element)
        },
        [size, setSize]
    )

    useEffect(() => {
        if (!posts || posts.length === 0) return

        const id = posts[posts.length - 1]._id

        if (id !== observedPost) {
            setObservedPost(id)
            observeElement(document.getElementById(id))
        }
    }, [posts, observedPost, observeElement])

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
            {head()}
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
                                    <PostCard
                                        post={post}
                                        key={post._id}
                                        id={post._id}
                                    />
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
