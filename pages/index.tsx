import { PostGrid, BlogCategory } from '../components/blog'
import { NextRouter, withRouter } from 'next/router'
import Head from 'next/head'
import { singleCategory } from '../actions/category'
import mergeStyles, {
    featuredConfig,
    trendingConfig,
} from '../hooks/mergeStyles'
import Carousel from '../components/carousel/Carousel'
import Footer from '../components/Footer'
import Link from 'next/link'
import useSWR from 'swr'
import { IBlog } from 'types'

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
    const { data: recentPosts } = useSWR<any>(
        `${process.env.NEXT_PUBLIC_API}/category/recent-post`,
        (url) => fetch(url).then((r: any) => r.blogs.json()),
        {
            initialData: recent,
        }
    )

    trending && mergeStyles(trending, trendingConfig)
    featured && mergeStyles(featured, featuredConfig)

    const head = () => (
        <Head>
            <title>Home | {process.env.NEXT_PUBLIC_APP_NAME}</title>
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

    return (
        <>
            {head()}
            <main className="home">
                <Carousel />
                <section className="featured-posts-container">
                    <div>
                        <Link href="/categories/featured" passHref>
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
                        <Link href="/categories/recent-post" passHref>
                            <h1>Reacent Post</h1>
                        </Link>
                        <PostGrid posts={recentPosts!} />
                    </div>
                </section>

                <section className="trending-posts-container">
                    <div>
                        <Link href="/categories/trending" passHref>
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

export async function getStaticProps() {
    const { blogs: recent } = await singleCategory('recent-post')
    const { blogs: trending } = await singleCategory('trending')
    const { blogs: featured } = await singleCategory('featured')

    return {
        props: { recent, trending, featured },
        revalidate: 1,
    }
}

export default withRouter(Index)
