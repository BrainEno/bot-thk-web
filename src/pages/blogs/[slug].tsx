import React, { Suspense, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
    GetStaticPaths,
    GetStaticPathsResult,
    GetStaticProps,
    GetStaticPropsContext,
} from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ParsedUrlQuery } from 'querystring'

import ArticleActions from '../../components/article/ArticleActions'
import { TagRow } from '../../components/blog'
import BannerImg from '../../components/common/BannerImg'
import {
    GetBlogBySlugDocument,
    GetBlogBySlugQuery,
    GetBlogBySlugQueryVariables,
    GetRelatedBlogsQuery,
    PopulatedTag,
} from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { fetcher } from '../../graphql/gqlClient'
import { getLocaleFormatedTime } from '../../helpers/date'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { ServerSideTranslations } from '../../types'

const DisqusThread = dynamic(
    () =>
        import('../../components/common/DisqusThread').then(
            (mod) => mod.default
        ),
    {
        ssr: false,
    }
)

const Reader = dynamic(
    () => import('../../components/article/Reader').then((mod) => mod.default),
    {
        ssr: false,
    }
)

const RelatedBlogs = dynamic(() =>
    import('../../components/article/RelatedBlogs').then((mod) => mod.default)
)

interface ArticleProps {
    initialData: GetBlogBySlugQuery
    relatedBlogsInitialData: GetRelatedBlogsQuery
    slug: string
}

const Article: React.FC<ArticleProps> = ({
    slug,
    initialData,
    relatedBlogsInitialData,
}) => {
    const { t, i18n } = useTranslation('common')

    const user = useAuthStore((state) => state.user)
    const pathname = usePathname()
    const containerRef = useRef<HTMLDivElement | null>(null)
    const htmlRef = useRef<HTMLDivElement | null>(null)

    const { data: blog } = useQuery<
        GetBlogBySlugQuery,
        Error,
        GetBlogBySlugQuery['getBlogBySlug']
    >({
        queryKey: ['getBlogBySlug', slug],
        queryFn: fetcher<GetBlogBySlugQuery, GetBlogBySlugQueryVariables>(
            GetBlogBySlugDocument,
            { slug }
        ),
        enabled: !!slug,
        select: (res) => res.getBlogBySlug,
        initialData,
    })

    if (!blog) return 'loading'

    const withOutImage =
        !blog.imageUri || blog.imageUri === process.env.NEXT_PUBLIC_DEFULT_IMAGE

    const isLiked = Boolean(
        blog &&
            blog.likedBy &&
            blog.likedBy.map((l) => l._id).includes(user?._id)
    )

    const titleText = `${blog!.title} | ${process.env.NEXT_PUBLIC_APP_NAME}`

    const head = () => (
        <Head>
            <title>{titleText}</title>
            <meta name="description" content={blog!.description!} />
            <link
                rel="canonical"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/blogs/${slug}`}
            />
            <meta
                property="og:title"
                content={`${blog!.title}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta property="og:description" content={blog!.description!} />
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
            <meta property="og:image:secure_url" content={`${blog.imageUri}`} />
            <meta property="og:image:type" content="image/jpg" />
            <meta name="theme-color" content="#eff3f8" />
        </Head>
    )

    return (
        <>
            {head()}
            <div ref={htmlRef} className="article-container">
                {withOutImage ? (
                    <div style={{ marginBottom: 65 }} />
                ) : (
                    <BannerImg imgSrc={blog.imageUri!} alt={blog!.title} />
                )}
                <main className="article">
                    <article className="article-header-container">
                        <section className="article-header">
                            <h1>{blog && blog!.title}</h1>
                            <p>
                                <span className="author-text">
                                    {t('By')} : {'  '}
                                    {blog && (
                                        <Link
                                            href={`/profile/${blog.author?.username}`}
                                        >
                                            {blog.author?.name}
                                        </Link>
                                    )}
                                </span>
                                <span className="description-text">
                                    {' '}
                                    |{' '}
                                    {getLocaleFormatedTime(
                                        blog.createdAt,
                                        i18n.language
                                    )}
                                </span>
                            </p>
                            {blog && (
                                <TagRow tags={blog!.tags as PopulatedTag[]} />
                            )}
                        </section>
                    </article>
                    <Suspense fallback={null}>
                        <Reader blogContent={blog.body} />
                    </Suspense>
                    <div>
                        <article className="article-content">
                            {blog && (
                                <section
                                    ref={containerRef}
                                    dangerouslySetInnerHTML={{
                                        __html: blog!.body,
                                    }}
                                ></section>
                            )}
                        </article>
                        <Suspense>
                            <ArticleActions
                                isLiked={isLiked}
                                blogId={blog._id}
                                blogTitle={blog.title}
                                blogBody={blog.body}
                                title={blog.title}
                                description={blog.description}
                                pathname={pathname}
                                htmlRef={htmlRef}
                            />
                        </Suspense>
                    </div>
                </main>
            </div>
            <div className="article-page-bottom">
                <RelatedBlogs
                    initialData={relatedBlogsInitialData}
                    slug={slug}
                    tagIds={blog.tags!.map((t) => t._id.toString())}
                    catIds={blog.categories!.map((c) => c._id.toString())}
                />
                <div className="comments-contaienr">
                    <Suspense>
                        <DisqusThread
                            id={blog._id}
                            title={blog.title}
                            path={`blog/${blog.slug}`}
                        />
                    </Suspense>
                </div>
            </div>
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
        fallback: 'blocking',
    }
}

export const getStaticProps: GetStaticProps<ServerSideTranslations> = async ({
    params,
    locale,
}: GetStaticPropsContext) => {
    const slug = (params as ParsedUrlQuery).slug as string

    const initialData = await sdk.GetBlogBySlug({
        slug,
    })

    const catIds = initialData.getBlogBySlug.categories!.map((cat) => cat._id)
    const tagIds = initialData.getBlogBySlug.tags!.map((tag) => tag._id)

    const relatedBlogsInitialData = await sdk.GetRelatedBlogs({
        getRelatedBlogsSlug: slug,
        tagIds,
        catIds,
    })

    return {
        props: {
            initialData,
            relatedBlogsInitialData,
            slug: params!.slug!,
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
        revalidate: 10,
    }
}

export default Article
