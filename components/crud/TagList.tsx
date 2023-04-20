import React from 'react'

import { ListTagsQuery } from '../../gql/sdk'

interface TagListProps {
    tags: ListTagsQuery['listTags']
}

export const TagList = ({ tags }: TagListProps) => {
    return (
        <div>
            <h5>
                标签 <small className="text-muted">{`(可选)`}</small>
            </h5>
            <hr />
            <ul>
                {tags.map((tag) => (
                    <li key={tag._id}>{tag.name}</li>
                ))}
            </ul>
        </div>
    )
}
