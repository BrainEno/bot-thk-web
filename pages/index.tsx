import { PostGrid, BlogCategory } from '../components/blog'
import { NextRouter, withRouter } from 'next/router'
import Head from 'next/head'
import { singleCategory } from '../actions/category'
import { mergeStyles } from '../helpers/mergeStyles'
import { APP_NAME, DOMAIN } from '../config'
import Carousel from '../components/carousel/Carousel'
import Footer from '../components/Footer'
import Link from 'next/link'
import useSWR from 'swr'
import { IBlog } from 'types'

interface IndexPageProps {
    router: NextRouter
    recentPost: IBlog[]
    trending: IBlog[]
    featured: IBlog[]
}

const Index: React.FC<IndexPageProps> = ({
    router,
    recentPost,
    trending,
    featured,
}) => {
    const { data: recentPosts } = useSWR(
        `${process.env.NEXT_PUBLIC_API}/category/recent-post`,
        initRecent,
        {
            initialData: recentPost,
        }
    )

    const trendingConfig = {
        0: {
            gridArea: '1/2/3/3',
        },
        1: { height: '173px' },
        3: {
            height: '173px',
        },
    }

    const featuredConfig = {
        0: {
            gridArea: '2/3/5/5',
            height: '635px',
        },
        1: {
            gridArea: '1/1/2/5',
            height: '400px',
        },

        2: {
            height: '300px',
        },
        3: {
            height: '300px',
        },
        4: {
            gridArea: '3/1/4/3',
            height: '300px',
        },
    }

    if (trending) mergeStyles(trending, trendingConfig)
    if (featured) mergeStyles(featured, featuredConfig)

    const head = () => (
        <Head>
            <title>Home | {APP_NAME}</title>
            <meta
                name="description"
                content="Cruel Literature,novels,poemes,and else"
            />
            <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
            <meta
                property="og:title"
                content={`Cruel Literature,novels,poemes,and else | ${APP_NAME}`}
            />
            <meta
                property="og:description"
                content="Cruel Literature,novels,poemes,and else"
            />
            <meta property="og:type" content="webiste" />
            <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
            <meta property="og:site_name" content={`${APP_NAME}`} />

            <meta property="og:image" content={`${DOMAIN}/images/recent.jpg`} />
            <meta
                property="og:image:secure_url"
                content={`${DOMAIN}/images/recent.jpg`}
            />
            <meta property="og:image:type" content="image/jpg" />
            <meta name="theme-color" content="#eff3f8" />
        </Head>
    )

    return (
        <>
            {head()}
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
                            <h1>Reacent Post</h1>
                        </Link>
                        <PostGrid posts={recentPosts} />
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

function initRecent() {
    return new Promise((resolve, reject) => {
        singleCategory('recent-post').then((data) => {
            if (data.error) {
                reject(data.error)
            } else {
                resolve(data.blogs)
            }
        })
    })
}

function initTrending() {
    return new Promise((resolve, reject) => {
        singleCategory('trending').then((data) => {
            if (data.error) {
                reject(data.error)
            } else {
                resolve(data.blogs)
            }
        })
    })
}

function initFeatured() {
    return new Promise((resolve, reject) => {
        singleCategory('featured').then((data) => {
            if (data.error) {
                reject(data.error)
            } else {
                resolve(data.blogs)
            }
        })
    })
}

export async function getStaticProps() {
    const recentPost = await initRecent()
    const trending = await initTrending()
    const featured = await initFeatured()
    return { props: { recentPost, trending, featured }, revalidate: 1 }
}

export default withRouter(Index)
