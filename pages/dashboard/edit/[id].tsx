import { useRouter } from 'next/router'

import { showAlert } from '../../../components/Common/Alert'
import { BlogForm } from '../../../components/crud/BlogForm'
import { sdk } from '../../../gqlSDK'
import { getErrorMsg } from '../../../helpers/getErrorMsg'

const EditBlog = () => {
    const { query } = useRouter()
    const { data, error } = sdk.useGetBlogById(`/edit/${query.id}`, {
        blogId: query.id as string,
    })

    const blog = data?.getBlogById
    const tagIds = blog?.tags.map((t) => t._id) ?? []

    return (
        <div className="blog-form-container">
            {showAlert(getErrorMsg(error), 'error')}{' '}
            {blog && (
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
        </div>
    )
}

export default EditBlog
