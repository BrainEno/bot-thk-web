import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from 'react'
import { MdOutlineCheckCircleOutline } from 'react-icons/md'
import { RiCheckboxBlankCircleLine } from 'react-icons/ri'
import { VscSave } from 'react-icons/vsc'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'

import { sdk } from '../../generated/sdk'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useTagStore } from '../../hooks/store/useTagsStore'
import useWindowSize from '../../hooks/useWindowSize'
import { showAlert } from '../common/Alert'

interface TagListProps {
    isVisible: boolean
    selectedTags: string[]
    setSelectedTags: Dispatch<SetStateAction<string[]>>
    setIsVisible: Dispatch<SetStateAction<boolean>>
}

export const TagList = ({
    selectedTags,
    setSelectedTags,
    isVisible,
    setIsVisible,
}: TagListProps) => {
    const { windowWidth } = useWindowSize()
    const user = useAuthStore((state) => state.user)
    const [tagName, setTagName] = useState('')
    const [showTagForm, setShowTagForm] = useState(false)
    const [error, setError] = useState('')
    const tags = useTagStore((state) => state.tags)
    const listTags = useTagStore((state) => state.list)
    const chipListRef = useRef<HTMLDivElement | null>(null)

    const onTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setTagName(value)
    }

    useEffect(() => {
        if (windowWidth && windowWidth < 900) setIsVisible(false)
    }, [windowWidth, setIsVisible])

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

        setSelectedTags(selected)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="tag-list-container"
                    style={{ transformOrigin: 'bottom left' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                >
                    {error && showAlert(error, 'error')}
                    <div className="tag-list" ref={chipListRef}>
                        {tags.map((tag) => (
                            <div
                                className={classNames('chip', {
                                    selected: selectedTags.includes(tag._id),
                                })}
                                onClick={handleTagsSelect(tag._id)}
                                key={tag._id}
                            >
                                {windowWidth &&
                                    windowWidth < 900 &&
                                    (selectedTags.includes(tag._id) ? (
                                        <MdOutlineCheckCircleOutline
                                            size={14}
                                            color="#fff"
                                        />
                                    ) : (
                                        <RiCheckboxBlankCircleLine
                                            size={14}
                                            color="#c1c1c1"
                                        />
                                    ))}
                                {tag.name}
                            </div>
                        ))}
                    </div>
                    {user?.role === '1' && (
                        <button
                            type="button"
                            title="自定义标签"
                            className="tag-add-btn"
                            onClick={() => setShowTagForm(!showTagForm)}
                        >
                            {showTagForm ? 'x' : '+'}
                        </button>
                    )}
                    {showTagForm && (
                        <div className="tag-input">
                            <input
                                value={tagName}
                                onChange={onTagChange}
                                type="text"
                            />
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
                </motion.div>
            )}
        </AnimatePresence>
    )
}
