import { useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NextRouter, withRouter } from 'next/router'
import { IBlog } from 'types'

import { BlogCategory, PostGrid } from '../components/blog'
import Carousel from '../components/carousel/Carousel'
import Footer from '../components/Footer'
import { getSdk } from '../gql/sdk'
import { gqlClient } from '../graphql/gqlClient'
import mergeStyles, {
    featuredConfig,
    trendingConfig,
} from '../helpers/mergeStyles'

interface IndexPageProps {
    router: NextRouter
    recent: IBlog[]
    trending: IBlog[]
    featured: IBlog[]
}

const Index: React.FC<IndexPageProps> = ({
    router,
    recent,
    trending,
    featured,
}) => {
    trending && mergeStyles(trending, trendingConfig)
    featured && mergeStyles(featured, featuredConfig)

    const head = useCallback(() => {
        return (
            <Head>
                <title>{`Home | ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
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
                    content={`Cruel Literature,novels,poemes,and else | ${process.env.NEXT_PUBLIC_APP_NAME}`}
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

                <meta
                    property="og:image"
                    content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/recent.jpg`}
                />
                <meta
                    property="og:image:secure_url"
                    content={`${process.env.NEXT_PUBLIC_DOMAIN}/images/recent.jpg`}
                />
                <meta property="og:image:type" content="image/jpg" />
                <meta name="theme-color" content="#eff3f8" />
            </Head>
        )
    }, [router.pathname])

    return (
        <>
            {process.env && head()}
            <main className="home">
                <Carousel />
                <section className="featured-posts-container">
                    <div>
                        <Link href="/categories/featured">
                            <h1>Featured</h1>
                        </Link>
                        <BlogCategory
                            posts={featured.slice(0, 5)}
                            columns={4}
                            tagsOnTop={true}
                        />
                    </div>
                </section>

                <section className="bg-white">
                    <div className="recent-container">
                        <Link href="/categories/recent-post">
                            <h1>Recent Post</h1>
                        </Link>
                        {<PostGrid posts={recent!} />}
                    </div>
                </section>

                <section className="trending-posts-container">
                    <div>
                        <Link href="/categories/trending">
                            <h1>Trending</h1>
                        </Link>
                        <BlogCategory
                            posts={trending.slice(0, 5)}
                            columns={3}
                            tagsOnTop={true}
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export const getStaticProps = async () => {
    const sdk = getSdk(gqlClient)

    const { getCatBlogs: recent } = await sdk.GetCatBlogs({
        getCatBlogsSlug: 'recent-post',
    })
    const { getCatBlogs: trending } = await sdk.GetCatBlogs({
        getCatBlogsSlug: 'trending',
    })
    const { getCatBlogs: featured } = await sdk.GetCatBlogs({
        getCatBlogsSlug: 'featured',
    })

    return {
        props: { recent, trending, featured },
        revalidate: 1,
    }
}

export default withRouter(Index)
