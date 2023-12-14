import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { PostGrid } from '../../components/blog'
import { PopulatedCardBlog } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { ServerSideTranslations } from '../../types'

interface ICategoryProps {
    catName: string
    catBlogs: PopulatedCardBlog[]
    catSlug: string
}
const Category: React.FC<ICategoryProps> = ({ catName, catBlogs, catSlug }) => {
    const { t } = useTranslation('common')
    const titleText = `${catName} | ${process.env.NEXT_PUBLIC_APP_NAME}`

    const head = () => (
        <Head>
            <title>{titleText}</title>
            <meta name="description" content={`${catName} articles`} />
            <link
                rel="canonical"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/categories/${catSlug}`}
            />
            <meta
                property="og:title"
                content={`${catName}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta property="og:description" content={`${catName} articles`} />
            <meta property="og:type" content="webiste" />
            <meta
                property="og:url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/categories/${catSlug}`}
            />
            <meta
                property="og:site_name"
                content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
            />

            <meta
                property="og:image"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/static/images/${catSlug}.jpg`}
            />
            <meta
                property="og:image:secure_url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/static/images/${catSlug}.jpg`}
            />
            <meta property="og:image:type" content="image/jpg" />
        </Head>
    )

    return (
        <>
            {catName && head()}
            <main className="tagBlogs">
                <section className="tagBlogs-container">
                    <h1>{t(catSlug)}</h1>
                    <div className="tag-blog-cards">
                        <PostGrid posts={catBlogs} />
                    </div>
                </section>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps<
    ServerSideTranslations
> = async ({ params, locale }) => {
    const catSlug = params!.slug as string
    // eslint-disable-next-line no-useless-escape
    const matchFirst = /(?<=[\.!?]\s)([a-z])|^([a-z])/g
    const catName = catSlug
        .replace(matchFirst, (match) => match.toUpperCase())
        .replace(/-/g, ' ')

    const { getCatBlogs: catBlogs } = await sdk.GetCatBlogs({
        getCatBlogsSlug: catSlug,
    })

    return {
        props: {
            catBlogs,
            catName,
            catSlug,
            ...(await serverSideTranslations(locale ?? 'en', ['common'])),
        },
    }
}

export default Category
