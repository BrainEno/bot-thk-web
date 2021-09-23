import Head from 'next/head'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { BlogCategory, TagRow } from '../../components/blog'
import React from 'react'
import SlideImage from '../../components/SlideImage'
import dayjs from 'dayjs'
import { singleBlog, listRelated } from '../../actions/blog'
import { singleCategory } from '../../actions/category'
import { IBlog } from '../../types'
import {
    GetStaticPaths,
    GetStaticPathsResult,
    GetStaticProps,
    GetStaticPropsContext,
} from 'next'
import mergeStyles, { relatedConfig } from '../../hooks/mergeStyles'
// import useBlog from '../../hooks/useBlog'
import useSWR from 'swr'
const DisqusThread = dynamic(() => import('../../components/DisqusThread'), {
    ssr: false,
})
const ReadBlog = dynamic(() => import('../../components/blog/ReadBlog'), {
    ssr: false,
})

interface SingleBlogProps {
    initialBlog: IBlog
    id: string
    relatedBlogs: IBlog[]
}

const SingleBlog: React.FC<SingleBlogProps> = ({
    initialBlog,
    id,
    relatedBlogs,
}) => {
    const { data: blog, error } = useSWR(
        process.env.NEXT_PUBLIC_API && id
            ? [`${process.env.NEXT_PUBLIC_API}/blog`, id]
            : null,
        (url, id) => fetch(`${url}/${id}`).then((r) => r.json()),
        { fallbackData: initialBlog }
    )

    const showComents = () => {
        return (
            <DisqusThread
                id={blog!._id}
                title={blog!.title}
                path={`blog/${blog!._id}`}
            />
        )
    }

    const head = () => (
        <Head>
            <title>
                {blog!.title} | {process.env.NEXT_PUBLIC_APP_NAME}
            </title>
            <meta name="description" content={blog!.description} />
            <link
                rel="canonical"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${blog!._id}`}
            />
            <meta
                property="og:title"
                content={`${blog!.title}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta property="og:description" content={blog!.description} />
            <meta property="og:type" content="webiste" />
            <meta
                property="og:url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${blog!._id}`}
            />
            <meta
                property="og:site_name"
                content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta
                property="og:image"
                content={`${process.env.NEXT_PUBLIC_API}/blog/image/${
                    blog!._id
                }`}
            />
            <meta
                property="og:image:secure_url"
                content={`${process.env.NEXT_PUBLIC_API}/blog/image/${
                    blog!._id
                }`}
            />
            <meta property="og:image:type" content="image/jpg" />
            <meta name="theme-color" content="#eff3f8" />
        </Head>
    )

    relatedBlogs && mergeStyles(relatedBlogs, relatedConfig)

    const showRelatedBlog = () => {
        return (
            <BlogCategory posts={relatedBlogs} columns={3} tagsOnTop={true} />
        )
    }

    return (
        <>
            {blog && head()}
            <SlideImage imgSrc={`/blog/image/${blog!._id}`} alt={blog!.title} />
            <main className="blog-article">
                <article className="article-header-container">
                    <section className="article-header">
                        <>
                            <h1>{blog!.title}</h1>
                        </>
                        <p>
                            <span className="author-text">
                                By : {'  '}
                                <Link
                                    href={`/profile/${blog!.author.username}`}
                                >
                                    {blog!.author.name}
                                </Link>
                            </span>
                            <span className="description-text">
                                {' '}
                                |{' '}
                                {dayjs(blog!.createdAt, 'zh', true).format(
                                    'MMMM,DD,YYYY'
                                )}
                            </span>
                        </p>
                        <TagRow tags={error ? initialBlog.tags : blog!.tags} />
                    </section>
                </article>
                {blog && <ReadBlog blog={blog} />}
                <article className="article-content">
                    {error ? (
                        <div>正在加载...</div>
                    ) : (
                        <section
                            dangerouslySetInnerHTML={{
                                __html: blog!.body,
                            }}
                        ></section>
                    )}
                </article>
                <div className="contaienr" style={{ padding: '35px' }}>
                    {blog! && showComents()}
                </div>
                <div className="container">
                    <h4 className="text-center">相关推荐</h4>
                    <div className="related-blogs">
                        {relatedBlogs && showRelatedBlog()}
                    </div>
                </div>
            </main>
        </>
    )
}

const getBlogsByCat = (category: string): Promise<IBlog[]> => {
    return new Promise((resolve, reject) => {
        singleCategory(category).then((data) => {
            if (data.error) {
                reject(data.error)
            } else {
                resolve(data.blogs)
            }
        })
    })
}

export const getStaticPaths: GetStaticPaths =
    async (): Promise<GetStaticPathsResult> => {
        const recentPosts = await getBlogsByCat('recent-post')
        const trendingPosts = await getBlogsByCat('trending')
        const featuredPosts = await getBlogsByCat('featured')
        const posts = [...recentPosts, ...trendingPosts, ...featuredPosts]

        const paths = posts.map((post) => ({
            params: {
                id: post._id,
            },
        }))

        return {
            paths,
            fallback: true,
        }
    }

export const getStaticProps: GetStaticProps = async ({
    params,
}: GetStaticPropsContext) => {
    const initialBlog = await singleBlog(params!.id as any)
    const blog = {
        _id: initialBlog._id,
        tags: initialBlog.tags,
        categories: initialBlog.categories,
    }
    const relatedBlogs = await listRelated({ blog })

    return {
        props: { initialBlog, relatedBlogs, id: params!.id! },
        revalidate: 1,
    }
}

export default SingleBlog
