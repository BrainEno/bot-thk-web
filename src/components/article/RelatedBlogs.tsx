import React, { memo, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'next-i18next'

import {
    GetRelatedBlogsDocument,
    GetRelatedBlogsQuery,
    GetRelatedBlogsQueryVariables,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'
import { PostMasonry } from '../blog'

interface RelatedBlogsProps {
    initialData: GetRelatedBlogsQuery
    slug: string
    tagIds: string[]
    catIds: string[]
    limit?: number
}

const RelatedBlogs = ({
    initialData,
    slug,
    tagIds,
    catIds,
    limit = 3,
}: RelatedBlogsProps) => {
    const { t } = useTranslation('common')
    const { data: relatedBlogs } = useQuery<
        GetRelatedBlogsQuery,
        Error,
        GetRelatedBlogsQuery['getRelatedBlogs']
    >({
        queryKey: ['listBlogWithCatTag'],
        queryFn: fetcher<GetRelatedBlogsQuery, GetRelatedBlogsQueryVariables>(
            GetRelatedBlogsDocument,
            { getRelatedBlogsSlug: slug, limit, tagIds, catIds }
        ),
        select: (res) => res.getRelatedBlogs,
        initialData,
    })

    const blogs = useMemo(() => {
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
        <div className="related-blogs-container">
            <h4 className="text-center">{t('Related blogs')}</h4>
            <div className="related-blogs">{blogs}</div>
        </div>
    )
}

export default memo(RelatedBlogs)
