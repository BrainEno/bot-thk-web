import { useQuery } from '@tanstack/react-query'
import Head from 'next/head'
import { NextRouter, withRouter } from 'next/router'

import PostInfo from '../../components/blog/PostInfo'
import {
    ListBlogsWithCatTagDocument,
    ListBlogsWithCatTagQuery,
} from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { fetcher } from '../../graphql/gqlClient'

type BlogsProps = {
    router: NextRouter
    initialData: ListBlogsWithCatTagQuery
}

const Blogs = ({ router, initialData }: BlogsProps) => {
    const { isLoading, data, error } = useQuery<
        ListBlogsWithCatTagQuery,
        Error,
        ListBlogsWithCatTagQuery['listBlogsWithCatTag']
    >(['ListBlogsWithCatTag'], fetcher(ListBlogsWithCatTagDocument), {
        initialData,
        select: (res) => res.listBlogsWithCatTag,
    })

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
        <>
            {head()}
            <main className="allBlogs">
                <section className="all-blogs-container">
                    <h1>All Blogs</h1>
                    <div className="all-blog-cards">
                        <section className="post-grid">
                            {error || isLoading
                                ? initialData.listBlogsWithCatTag.map(
                                      (post: any) => (
                                          <PostInfo
                                              post={post}
                                              key={post._id}
                                          />
                                      )
                                  )
                                : data.map((post: any) => (
                                      <PostInfo post={post} key={post._id} />
                                  ))}
                        </section>
                    </div>
                </section>
            </main>
        </>
    )
}

export default withRouter(Blogs)

export const getStaticProps = async () => {
    const initialData = await sdk.ListBlogsWithCatTag()

    return {
        props: { initialData },
        revalidate: 1,
    }
}
