import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { BiHide, BiShow } from 'react-icons/bi'
import { BsTags } from 'react-icons/bs'
import { GrImage } from 'react-icons/gr'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { BlogInput } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { QuillFormats, QuillModules } from '../../helpers/ToolbarOptions'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useTagStore } from '../../hooks/store/useTagsStore'
import { useIndexDB } from '../../hooks/useIndexDB'
import { useUploadImage } from '../../hooks/useUpload'
import { showAlert } from '../common/Alert'
import BannerImg from '../common/BannerImg'

import { TagList } from './TagList'

const defaultImgUri =
    'https://res.cloudinary.com/hapmoniym/image/upload/v1644331126/bot-thk/no-image_eaeuge.jpg'

const ReactQuill = dynamic(
    () => import('react-quill').then((mod) => mod.default),
    {
        ssr: false,
    }
)

export type FormType = 'create' | 'edit'

interface BlogFormProps {
    formType: FormType
    draftTitle?: string
    draftBody?: string
    draftImg?: string
    draftActive?: boolean
    draftTags?: string[]
    blogId?: string
}

export const BlogForm = ({
    formType,
    draftActive,
    draftBody,
    draftImg,
    draftTitle,
    draftTags,
    blogId,
}: BlogFormProps) => {
    const router = useRouter()
    const blogContainerRef = useRef<null | HTMLDivElement>(null)
    const queryClient = useQueryClient()

    const user = useAuthStore((state) => state.user)
    const imageInput = useRef<HTMLInputElement | null>(null)
    const [title, setTitle] = useState('')
    const [active, setActive] = useState(false)

    const listTags = useTagStore((state) => state.list)

    const [body, setBody] = useState<string>('')
    const [msg, setMsg] = useState('')
    const [err, setErr] = useState('')
    const { image, setImage, upload, error } = useUploadImage()
    const [showBanner, setShowBanner] = useState(!!image || false)
    const [showTags, setShowTags] = useState(!!draftTags?.length || false)
    const [selectedTags, setSelectedTags] = useState<string[]>(draftTags ?? [])

    /**IndexDB */
    const { add, get, edit } = useIndexDB()

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setTitle(value)
    }

    const handleCancel = () => {
        if (formType === 'create') {
            localStorage.setItem('draft-content', body)
            localStorage.setItem('draft-title', title)
        }

        router.push({ pathname: '/dashboard' })
    }

    const handleContainerScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.scrollTop > 10) setShowBanner(false)
    }

    const initCreateData = useCallback(() => {
        const draftTitleLS = localStorage.getItem('draft-title')
        const draftBodyLS = localStorage.getItem('draft-content')
        if (draftBodyLS) setBody(draftBodyLS)
        if (draftTitleLS) setTitle(draftTitleLS)
    }, [])

    const initEditData = useCallback(() => {
        if (!blogId) return
        const draftInIDB = get(blogId)
        console.log('draft in IndexDB:', draftInIDB)
        if (draftBody) setBody(draftInIDB?.body || draftBody)
        if (draftActive) setActive(draftInIDB?.active || draftActive)
        if (draftTitle) setTitle(draftInIDB?.title || draftTitle)
        if (draftImg) setImage(draftImg)
        if (draftTags) setSelectedTags(draftTags)
    }, [
        blogId,
        get,
        draftActive,
        draftBody,
        draftImg,
        draftTags,
        draftTitle,
        setImage,
    ])

    const publishBlog = async () => {
        const blogInput: BlogInput = { body, title, active, imageUri: image }
        if (!blogInput.imageUri) {
            blogInput.imageUri = defaultImgUri
        }
        if (!blogInput.active) blogInput.active = true

        if (!selectedTags.length) {
            setMsg('点击下方标签图标为文章添加标签')
            return
        }

        if (formType === 'create') {
            const res = await sdk.CreateBlog({
                blogInput,
                tagIds: selectedTags,
            })
            if (!res.createBlog.success) {
                setErr('文章发布失败，请稍后重试')
            }
            queryClient.invalidateQueries({ queryKey: ['userBlogs'] })
        } else if (formType === 'edit') {
            if (blogId) {
                const res = await sdk.UpdateBlog({
                    blogInput,
                    blogId: blogId,
                    tagIds: selectedTags,
                })
                if (!res.updateBlog.success) {
                    setErr('文章更新失败，请稍后重试')
                }
                queryClient.invalidateQueries({ queryKey: ['userBlogs'] })
                queryClient.invalidateQueries({
                    queryKey: ['getBlogById', blogId],
                })

                edit(blogId, {
                    id: blogId,
                    title,
                    body,
                    tags: selectedTags,
                    active,
                })
                localStorage.removeItem('draft-title')
                localStorage.removeItem('draft-content')
            }
        }

        setTitle('')
        setImage('')
        setActive(false)
        setBody('')

        router.push({ pathname: '/dashboard' })
    }

    const saveBlog = async () => {
        console.log(get(title))
        const blogInput: BlogInput = {
            body,
            title,
            active: false,
            imageUri: image,
        }
        if (!blogInput.imageUri) {
            blogInput.imageUri = defaultImgUri
        }

        if (formType === 'create') {
            const res = await sdk.CreateBlog({
                blogInput,
                tagIds: selectedTags,
            })

            if (!res.createBlog.success) {
                setErr('文章保存失败，请重试')
            }

            const blogId = res.createBlog.blog?._id
            queryClient.invalidateQueries({ queryKey: ['userBlogs'] })
            if (blogId)
                add({
                    id: blogId,
                    title,
                    body,
                    tags: selectedTags,
                    active,
                })

            localStorage.setItem('draft-title', title)
            localStorage.setItem('draft-content', body)
        } else if (formType === 'edit') {
            if (blogId) {
                const res = await sdk.UpdateBlog({
                    blogInput,
                    blogId: blogId,
                    tagIds: selectedTags,
                })
                if (!res.updateBlog.success) {
                    setErr('文章保存失败，请重试')
                }
                queryClient.invalidateQueries({ queryKey: ['userBlogs'] })
                edit(blogId, {
                    id: blogId,
                    title,
                    body,
                    tags: selectedTags,
                    active,
                })
            }
        }
    }

    const handleTags = () => {
        setShowTags(!showTags)
    }

    useEffect(() => {
        if (!user) {
            router.push({ pathname: '/signin' })
        }
    }, [router, user])

    useEffect(() => {
        listTags()
    }, [listTags])

    useEffect(() => {
        if (formType === 'create') {
            initCreateData()
        } else if (formType === 'edit') {
            initEditData()
        }

        return () => {
            setBody('')
            setTitle('')
            setActive(false)
        }
    }, [formType, initCreateData, initEditData])

    return (
        <div
            className="blog-form-container"
            ref={blogContainerRef}
            onScroll={handleContainerScroll}
        >
            {msg && showAlert(msg, 'info')}
            {err && showAlert(err, 'error')}
            {error && showAlert(error, 'error')}
            <form className="blog-form" onSubmit={publishBlog}>
                <div className="title-container">
                    <input
                        type="text"
                        className="title-form"
                        value={title}
                        name="title"
                        onChange={handleTitle}
                        placeholder="输入标题"
                    />
                    <div className="separator"> / </div>
                    <div className="blog-form-icons">
                        <label
                            className="icon-btn"
                            title="更改图片"
                            htmlFor="blog-image"
                        >
                            <input
                                type="file"
                                id="blog-image"
                                accept="image/*"
                                hidden
                                ref={imageInput}
                                onChange={upload}
                            />
                            <GrImage />
                        </label>
                        {showBanner ? (
                            <button
                                type="button"
                                className="icon-btn"
                                title="隐藏图片"
                                onClick={() => {
                                    setShowBanner(false)
                                }}
                            >
                                <BiHide />
                            </button>
                        ) : (
                            image && (
                                <button
                                    type="button"
                                    className="icon-btn"
                                    onClick={() => {
                                        blogContainerRef?.current?.scrollTo({
                                            top: 0,
                                            behavior: 'smooth',
                                        })
                                        setTimeout(() => {
                                            setShowBanner(true)
                                        }, 500)
                                    }}
                                    title="预览图片"
                                >
                                    <BiShow />
                                </button>
                            )
                        )}
                    </div>
                </div>

                <div
                    className={classNames('body-container', {
                        ['without-img']: !showBanner,
                    })}
                >
                    {image && (
                        <BannerImg
                            imgSrc={image}
                            alt={title}
                            isVisible={showBanner}
                            inEditor={true}
                        />
                    )}
                    <Suspense fallback="loading...">
                        <ReactQuill
                            modules={QuillModules}
                            formats={QuillFormats}
                            value={body}
                            placeholder="开始创作..."
                            onChange={setBody}
                        />
                    </Suspense>
                </div>
                <div className="blog-form-bottom">
                    <div className="tags-form">
                        <button
                            type="button"
                            title="添加标签"
                            className="icon-btn"
                            onClick={handleTags}
                        >
                            <BsTags />
                        </button>

                        <TagList
                            selectedTags={selectedTags}
                            setSelectedTags={setSelectedTags}
                            isVisible={showTags}
                            setIsVisible={setShowTags}
                        />
                    </div>
                    <div className="form-btns">
                        <button
                            className="form-btn"
                            type="button"
                            onClick={handleCancel}
                        >
                            退出
                        </button>
                        <button
                            type="button"
                            className="form-btn"
                            onClick={publishBlog}
                        >
                            发布
                        </button>
                        <button
                            type="button"
                            className="form-btn"
                            onClick={saveBlog}
                        >
                            保存
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
