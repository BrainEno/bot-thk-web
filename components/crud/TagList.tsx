import React, { Dispatch, SetStateAction, useState } from 'react'
import { VscSave } from 'react-icons/vsc'
import classNames from 'classnames'

import { sdk } from '../../gqlSDK'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import { useTagStore } from '../../hooks/store/useTagsStore'
import { showAlert } from '../Common/Alert'

interface TagListProps {
    selectedTags: string[]
    setSelectedTags: Dispatch<SetStateAction<string[]>>
}

export const TagList = ({ selectedTags, setSelectedTags }: TagListProps) => {
    const [tagName, setTagName] = useState('')
    const [showTagForm, setShowTagForm] = useState(false)
    const [error, setError] = useState('')
    const tags = useTagStore((state) => state.tags)
    const listTags = useTagStore((state) => state.list)

    const onTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setTagName(value)
    }

    const submitNewTag = () => {
        if (!tagName) return

        sdk.NewTag({ tagName })
            .then((res) => {
                const created = res.newTag
                console.log(created)
                listTags()
            })
            .catch((error) => {
                if (error) setError(getErrorMsg(error))
            })
    }

    const handleTagsSelect = (tagId: string) => () => {
        const selected = [...selectedTags]
        const index = selected.indexOf(tagId)
        if (index !== -1) {
            selected.splice(index, 1)
        } else {
            selected.push(tagId)
        }
        console.log('selected:', selected)
        setSelectedTags(selected)
    }

    return (
        <div className="tag-list-container">
            {error && showAlert(error, 'error')}
            <div className="tag-list">
                {tags.map((tag) => (
                    <div
                        className={classNames('chip', {
                            selected: selectedTags.includes(tag._id),
                        })}
                        onClick={handleTagsSelect(tag._id)}
                        key={tag._id}
                    >
                        {tag.name}
                    </div>
                ))}
            </div>
            <button
                type="button"
                title="自定义标签"
                className="tag-add-btn"
                onClick={() => setShowTagForm(!showTagForm)}
            >
                {showTagForm ? 'x' : '+'}
            </button>
            {showTagForm && (
                <div className="tag-input">
                    <input value={tagName} onChange={onTagChange} type="text" />
                    <button
                        type="button"
                        className={classNames('tag-input-btn', {
                            show: tagName.length,
                        })}
                        onClick={submitNewTag}
                    >
                        <VscSave size={14} />
                    </button>
                </div>
            )}
        </div>
    )
}
