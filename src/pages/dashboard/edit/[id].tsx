import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { showAlert } from '../../../components/common/Alert'
import { BlogForm } from '../../../components/crud/BlogForm'
import {
    GetBlogByIdDocument,
    GetBlogByIdQuery,
} from '../../../generated/graphql-request'
import { fetcher } from '../../../graphql/gqlClient'
import { getErrorMsg } from '../../../helpers/getErrorMsg'

const EditBlog = () => {
    const { query } = useRouter()

    const {
        isLoading,
        data: blog,
        error,
    } = useQuery<GetBlogByIdQuery, Error, GetBlogByIdQuery['getBlogById']>(
        ['GetBlogById', query.id],
        fetcher(GetBlogByIdDocument, { blogId: query.id as string }),
        { enabled: !!(query && query.id), select: (res) => res.getBlogById }
    )

    const tagIds = blog?.tags.map((t) => t._id) ?? []

    return (
        <>
            {error && showAlert(getErrorMsg(error), 'error')}
            {!isLoading && (
                <BlogForm
                    formType="edit"
                    blogId={query.id as string}
                    draftBody={blog?.body}
                    draftActive={blog?.active ?? false}
                    draftImg={blog?.imageUri ?? ''}
                    draftTitle={blog?.title}
                    draftTags={tagIds}
                />
            )}
        </>
    )
}

export default EditBlog
