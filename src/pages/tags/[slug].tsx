import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import Head from 'next/head'

import { PostGrid } from '../../components/blog'
import { sdk } from '../../generated/sdk'
import { IBlog } from '../../types'

interface IBlogsWithTagProps {
    tagName: string
    tagSlug: string
    tagBlogs: IBlog[]
}
const BlogsWithTag: React.FC<IBlogsWithTagProps> = ({
    tagBlogs,
    tagName,
    tagSlug,
}) => {
    const titleText = `${tagName} | ${process.env.NEXT_PUBLIC_APP_NAME}`
    const head = () => (
        <Head>
            <title>{titleText}</title>
            <meta name="description" content={`${tagName} articles`} />
            <link
                rel="canonical"
                href={`${process.env.NEXT_PUBLIC_DOMAIN}/categories/${tagSlug}`}
            />
            <meta
                property="og:title"
                content={`${tagName}| ${process.env.NEXT_PUBLIC_APP_NAME}`}
            />
            <meta property="og:description" content={`${tagName} articles`} />
            <meta property="og:type" content="webiste" />
            <meta
                property="og:url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/categories/${tagSlug}`}
            />
            <meta
                property="og:site_name"
                content={`${process.env.NEXT_PUBLIC_APP_NAME}`}
            />

            <meta
                property="og:image"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/static/images/seoblog.jpg`}
            />
            <meta
                property="og:image:secure_url"
                content={`${process.env.NEXT_PUBLIC_DOMAIN}/static/images/seoblog.jpg`}
            />
            <meta property="og:image:type" content="image/jpg" />
        </Head>
    )

    return (
        <>
            {tagName && head()}
            <main className="tagBlogs">
                <section className="tagBlogs-container">
                    <h1>{tagName.toUpperCase()}</h1>
                    <div className="tag-blog-cards">
                        <PostGrid posts={tagBlogs} />
                    </div>
                </section>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({
    params,
}: GetServerSidePropsContext) => {
    const tagSlug = params!.slug as string
    // eslint-disable-next-line no-useless-escape
    const matchFirst = /(?<=[\.!?]\s)([a-z])|^([a-z])/g
    const tagName = tagSlug

        .replace(matchFirst, (match) => match.toUpperCase())
        .replace(/-/g, ' ')


    const { getTagBlogs: tagBlogs } = await sdk.GetTagBlogs({
        getTagBlogsSlug: tagSlug,
    })

    return {
        props: { tagBlogs, tagName, tagSlug },
    }
}

export default BlogsWithTag
