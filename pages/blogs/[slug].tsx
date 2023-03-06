import React from 'react'
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

import { gqlClient } from '../../apollo/gqlClient'
import { BlogCategory, TagRow } from '../../components/blog'
import SlideImage from '../../components/SlideImage'
import { getSdk } from '../../gql/sdk'
import mergeStyles, { relatedConfig } from '../../helpers/mergeStyles'
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
    const showComents = () => {
        return (
            <DisqusThread
                id={blog!._id}
                title={blog!.title}
                path={`blog/${blog!.slug}`}
            />
        )
    }

    const head = () => (
        <>
            {
                <Head>
                    <title>
                        {blog!.title} | {process.env.NEXT_PUBLIC_APP_NAME}
                    </title>
                    <meta name="description" content={blog!.description} />
                    <link
                        rel="canonical"
                        href={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${
                            blog!._id
                        }`}
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
                        content={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${
                            blog!._id
                        }`}
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
            }
        </>
    )

    // relatedBlogs && mergeStyles(relatedBlogs, relatedConfig)

    const showRelatedBlog = () => {
        return (
            <>
                {relatedBlogs && (
                    <BlogCategory
                        posts={relatedBlogs}
                        columns={3}
                        tagsOnTop={true}
                    />
                )}
            </>
        )
    }

    return (
        <>
            {blog && head()}
            {blog && <SlideImage imgSrc={blog.imageUri!} alt={blog!.title} />}
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
                                        'MMMM,DD,YYYY'
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
                <div className="contaienr" style={{ padding: '35px' }}>
                    {blog! && showComents()}
                </div>
                <div className="container">
                    <h4 className="text-center">相关推荐</h4>
                    <div className="related-blogs">
                        {/* {relatedBlogs && showRelatedBlog()} */}
                    </div>
                </div>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async (): Promise<
    GetStaticPathsResult<{ slug: string }>
> => {
    const sdk = getSdk(gqlClient)
    const { listBlogsWithCatTag: posts } = await sdk.ListBlogsWithCatTag()
    const paths = posts.map((post) => ({
        params: {
            slug: post.slug,
        },
    }))

    return {
        paths,
        // fallback: true
        fallback: false,
    }
}

export const getStaticProps: GetStaticProps = async ({
    params,
}: GetStaticPropsContext) => {
    const slug = params!.slug as string
    const sdk = getSdk(gqlClient)
    // const blog = await singleBlog(params!.id as any)
    const { getBlogBySlug: blog } = await sdk.GetBlogBySlug({
        slug,
    })

    const catIds = blog.categories.map((cat) => cat._id)
    const tagIds = blog.tags.map((tag) => tag._id)

    const relatedBlogs = await sdk.GetRelatedBlogs({
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
