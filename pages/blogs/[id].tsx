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
// import useBlog from '../../hooks/useBlog'
import mergeStyles, { relatedConfig } from '../../hooks/mergeStyles'

const DisqusThread = dynamic(() => import('../../components/DisqusThread'), {
    ssr: false,
})
const ReadBlog = dynamic(() => import('../../components/blog/ReadBlog'), {
    ssr: false,
})

interface SingleBlogProps {
    // initialBlog: IBlog
    // id: string
    blog: IBlog
    relatedBlogs: IBlog[]
}

const SingleBlog: React.FC<SingleBlogProps> = ({
    // initialBlog,
    // id,
    blog,
    relatedBlogs,
}) => {
    // const { data: blog } = useBlog(id)

    const showComents = () => {
        return (
            <DisqusThread
                id={blog._id}
                title={blog.title}
                path={`blog/${blog._id}`}
            />
        )
    }

    const head = () => (
        <Head>
            <title>
                {blog.title} | {process.env.NEXT_PUBLIC_APP_NAME}
            </title>
            <meta name="description" content={blog.description} />
            <link
                rel="canonical"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${blog._id}`}
            />
            <meta
                property="og:title"
                content={`${blog.title}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta property="og:description" content={blog.description} />
            <meta property="og:type" content="webiste" />
            <meta
                property="og:url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${blog._id}`}
            />
            <meta
                property="og:site_name"
                content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta
                property="og:image"
                content={`${process.env.NEXT_PUBLIC_API}/blog/image/${blog._id}`}
            />
            <meta
                property="og:image:secure_url"
                content={`${process.env.NEXT_PUBLIC_API}/blog/image/${blog._id}`}
            />
            <meta property="og:image:type" content="image/jpg" />
            <meta name="theme-color" content="#eff3f8" />
        </Head>
    )

    blog && mergeStyles(relatedBlogs, relatedConfig)

    const showRelatedBlog = () => {
        return (
            <BlogCategory posts={relatedBlogs} columns={3} tagsOnTop={true} />
        )
    }

    return (
        <>
            {blog && head()}
            <SlideImage imgSrc={`/blog/image/${blog._id}`} alt={blog.title} />
            <main className="blog-article">
                <article className="article-header-container">
                    <section className="article-header">
                        <>
                            <h1>{blog.title}</h1>
                        </>
                        <p>
                            <span className="author-text">
                                By : {'  '}
                                <Link href={`/profile/${blog.author.username}`}>
                                    {blog.author.name}
                                </Link>
                            </span>
                            <span className="description-text">
                                {' '}
                                |{' '}
                                {dayjs(blog.createdAt, 'zh', true).format(
                                    'MMMM,DD,YYYY'
                                )}
                            </span>
                        </p>
                        <TagRow tags={blog.tags} />
                    </section>
                </article>
                {blog && <ReadBlog blog={blog} />}
                <article className="article-content">
                    <section
                        dangerouslySetInnerHTML={{ __html: blog.body }}
                    ></section>
                </article>
                <div className="contaienr" style={{ padding: '35px' }}>
                    {blog && showComents()}
                </div>
                <div className="container">
                    <h4 className="text-center">相关推荐</h4>
                    <div className="related-blogs">{showRelatedBlog()}</div>
                </div>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths =
    async (): Promise<GetStaticPathsResult> => {
        const { blogs: recentPosts } = await singleCategory('recent-post')
        const { blogs: trendingPosts } = await singleCategory('trending')
        const { blogs: featuredPosts } = await singleCategory('featured')
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
    const currBlog = {
        _id: initialBlog._id,
        tags: initialBlog.tags,
        categories: initialBlog.categories,
    }
    const relatedBlogs = await listRelated({ currBlog })

    return {
        props: { blog: initialBlog, relatedBlogs, id: params!.id! },
        revalidate: 1,
    }
}

export default SingleBlog
