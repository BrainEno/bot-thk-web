import Head from 'next/head'
import { NextRouter, withRouter } from 'next/router'
import { SWRConfig } from 'swr'

import PostInfo from '../../components/blog/PostInfo'
import { sdk } from '../../gqlSDK'
import { ListBlogsWithCatTagQuery } from '../../gqlSDK/sdk'

type BlogsProps = {
    router: NextRouter
    posts: ListBlogsWithCatTagQuery['listBlogsWithCatTag']
}

const Blogs = ({ router, posts }: BlogsProps) => {
    const { data, error } = sdk.useListBlogsWithCatTag(
        '/blogs/all',
        {},
        { refreshInterval: 60 }
    )

    const isInitialLoading = !data && !error

    const titleText = `All Blogs | ${process.env.NEXT_PUBLIC_APP_NAME}`
    const head = () => (
        <Head>
            <title>{titleText}</title>
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
        <SWRConfig value={{ fallback: posts }}>
            {head()}
            <main className="allBlogs">
                <section className="all-blogs-container">
                    <h1>All Blogs</h1>
                    <div className="all-blog-cards">
                        {isInitialLoading ? (
                            <div className="loading-container">正在加载</div>
                        ) : (
                            <section className="post-grid">
                                {data &&
                                    data.listBlogsWithCatTag.map(
                                        (post: any) => (
                                            <PostInfo
                                                post={post}
                                                key={post._id}
                                            />
                                        )
                                    )}
                            </section>
                        )}
                    </div>
                </section>
            </main>
        </SWRConfig>
    )
}

export default withRouter(Blogs)

export const getServerSideProps = async () => {
    const { listBlogsWithCatTag: posts } = await sdk.ListBlogsWithCatTag()

    return {
        props: { posts },
    }
}
