import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { BlogForm } from '../../components/blog/BlogForm'
import { ServerSideTranslations } from '../../types'

const NewBlog = () => {
    return <BlogForm formType="create" />
}

export default NewBlog

export const getServerSideProps: GetServerSideProps<
    ServerSideTranslations
> = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', [
                'common',
                'dashboard',
            ])),
        },
    }
}
