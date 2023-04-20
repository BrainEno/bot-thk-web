import { GetServerSideProps } from 'next'
import Head from 'next/head'

import { PostMasonry } from '../../components/blog'
import { getSdk } from '../../gql/sdk'
import { gqlClient } from '../../graphql/gqlClient'
import { IBlog } from '../../types'

interface ICategoryProps {
    catName: string
    catBlogs: IBlog[]
    catSlug: string
}
const Category: React.FC<ICategoryProps> = ({ catName, catBlogs, catSlug }) => {
    const head = () => (
        <Head>
            <title>
                {catName} | {process.env.NEXT_PUBLIC_APP_NAME}
            </title>
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
            <main className="category-blogs">
                <section className="category-blogs-container">
                    <h1>{catName}</h1>
                    <PostMasonry
                        imgFor="default"
                        posts={catBlogs}
                        columns={3}
                        tagsOnTop={true}
                    />
                </section>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const catSlug = params!.slug as string
    // eslint-disable-next-line no-useless-escape
    const matchFirst = /(?<=[\.!?]\s)([a-z])|^([a-z])/g
    const catName = catSlug
        .replace(matchFirst, (match) => match.toUpperCase())
        .replace(/-/g, ' ')

    const sdk = getSdk(gqlClient)

    const { getCatBlogs: catBlogs } = await sdk.GetCatBlogs({
        getCatBlogsSlug: catSlug,
    })

    return {
        props: { catBlogs, catName, catSlug },
    }
}

export default Category
