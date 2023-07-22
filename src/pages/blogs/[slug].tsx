import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import {
    GetStaticPaths,
    GetStaticPathsResult,
    GetStaticProps,
    GetStaticPropsContext,
} from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'

import BannerImg from '../../components/BannerImg'
import { PostMasonry, TagRow } from '../../components/blog'
import { sdk } from '../../generated/sdk'
import { IBlog } from '../../types'

const DisqusThread = dynamic(() => import('../../components/DisqusThread'), {
    ssr: false,
})
const ReadBlog = dynamic(() => import('../../components/blog/ReadBlog'), {
    ssr: false,
})

interface SingleBlogProps {
    blog: IBlog
    slug: string
    relatedBlogs: IBlog[]
}

const SingleBlog: React.FC<SingleBlogProps> = ({
    blog,
    slug,
    relatedBlogs,
}) => {
    const blogComents = useMemo(() => {
        return (
            <DisqusThread
                id={blog!._id}
                title={blog!.title}
                path={`blog/${blog!.slug}`}
            />
        )
    }, [blog])

    const titleText = `${blog!.title} | ${process.env.NEXT_PUBLIC_APP_NAME}`
    const head = () => (
        <>
            {
                <Head>
                    <title>{titleText}</title>
                    <meta name="description" content={blog!.description} />
                    <link
                        rel="canonical"
                        href={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${slug}`}
                    />
                    <meta
                        property="og:title"
                        content={`${blog!.title}| ${
                            process.env.NEXT_PUBLIC_APP_NAME
                        }`}
                    />
                    <meta
                        property="og:description"
                        content={blog!.description}
                    />
                    <meta property="og:type" content="webiste" />
                    <meta
                        property="og:url"
                        content={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${slug}`}
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
                        content={`${blog.imageUri}`}
                    />
                    <meta property="og:image:type" content="image/jpg" />
                    <meta name="theme-color" content="#eff3f8" />
                </Head>
            }
        </>
    )

    const blogRelates = useMemo(() => {
        return (
            <>
                {relatedBlogs && (
                    <PostMasonry
                        imgFor="related"
                        posts={relatedBlogs}
                        columns={3}
                        tagsOnTop={true}
                    />
                )}
            </>
        )
    }, [relatedBlogs])

    return (
        <>
            {blog && head()}
            {blog && <BannerImg imgSrc={blog.imageUri!} alt={blog!.title} />}
            <main className="blog-article">
                <article className="article-header-container">
                    <section className="article-header">
                        <>
                            <h1>{blog && blog!.title}</h1>
                        </>
                        <p>
                            <span className="author-text">
                                By : {'  '}
                                {blog && (
                                    <Link
                                        href={`/profile/${
                                            blog!.author.username
                                        }`}
                                    >
                                        {blog!.author.name}
                                    </Link>
                                )}
                            </span>
                            <span className="description-text">
                                {' '}
                                |{' '}
                                {blog &&
                                    dayjs(blog!.createdAt, 'zh', true).format(
                                        'MMM,DD,YYYY'
                                    )}
                            </span>
                        </p>
                        {blog && <TagRow tags={blog.tags} />}
                    </section>
                </article>
                <ReadBlog blog={blog} />
                <article className="article-content">
                    {blog && (
                        <section
                            dangerouslySetInnerHTML={{
                                __html: blog!.body,
                            }}
                        ></section>
                    )}
                </article>
                <div className="container">
                    <h4 className="text-center">相关推荐</h4>
                    <div className="related-blogs">
                        {relatedBlogs && blogRelates}
                    </div>
                </div>
                <div className="contaienr" style={{ padding: '35px' }}>
                    {blog! && blogComents}
                </div>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async (): Promise<
    GetStaticPathsResult<{ slug: string }>
> => {
    const { listBlogsWithCatTag: posts } = await sdk.ListBlogsWithCatTag()
    const paths = posts.map((post) => ({
        params: {
            slug: post.slug,
        },
    }))

    return {
        paths,
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps = async ({
    params,
}: GetStaticPropsContext) => {
    const slug = params!.slug as string

    const { getBlogBySlug: blog } = await sdk.GetBlogBySlug({
        slug,
    })

    const catIds = blog.categories.map((cat) => cat._id)
    const tagIds = blog.tags.map((tag) => tag._id)

    const { getRelatedBlogs: relatedBlogs } = await sdk.GetRelatedBlogs({
        getRelatedBlogsSlug: blog.slug,
        tagIds,
        catIds,
    })

    return {
        props: { blog, relatedBlogs, slug: params!.slug! },
        revalidate: 5,
    }
}

export default SingleBlog
