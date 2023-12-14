import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { NextRouter, withRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import PostInfo from '../../components/blog/PostWithInfo'
import {
    ListBlogsWithCatTagDocument,
    ListBlogsWithCatTagQuery,
} from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { fetcher } from '../../graphql/gqlClient'
import { ServerSideTranslations } from '../../types'

type BlogsProps = {
    router: NextRouter
    initialData: ListBlogsWithCatTagQuery
}

const Blogs = ({ router, initialData }: BlogsProps) => {
    const { isLoading, data, error } = useQuery<
        ListBlogsWithCatTagQuery,
        Error,
        ListBlogsWithCatTagQuery['listBlogsWithCatTag']
    >({
        queryKey: ['ListBlogsWithCatTag'],
        queryFn: fetcher(ListBlogsWithCatTagDocument),
        initialData,
        select: (res) => res.listBlogsWithCatTag,
    })
    const { t } = useTranslation('common')

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

    const postInfo = useMemo(() => {
        return error || isLoading
            ? initialData.listBlogsWithCatTag.map((post: any) => (
                  <PostInfo post={post} key={post._id} />
              ))
            : data.map((post: any) => <PostInfo post={post} key={post._id} />)
    }, [data, error, isLoading, initialData.listBlogsWithCatTag])

    return (
        <>
            {head()}
            <main className="allBlogs">
                <section className="all-blogs-container">
                    <h1>{t('all-page')}</h1>
                    <div className="all-blog-cards">
                        <section className="post-grid">{postInfo}</section>
                    </div>
                </section>
            </main>
        </>
    )
}

export default withRouter(Blogs)

export const getServerSideProps: GetServerSideProps<
    ServerSideTranslations
> = async ({ locale }) => {
    const initialData = await sdk.ListBlogsWithCatTag()

    return {
        props: {
            initialData,
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    }
}
