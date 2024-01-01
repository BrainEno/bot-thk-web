import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { BiHide, BiShow } from 'react-icons/bi'
import { BsSend, BsTags } from 'react-icons/bs'
import { GrImage } from 'react-icons/gr'
import { IoArrowBackCircleOutline, IoSaveOutline } from 'react-icons/io5'
import { MdOutlinePublic, MdOutlinePublicOff } from 'react-icons/md'
import { useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import localforage from 'localforage'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { BlogInput } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { QuillFormats, QuillModules } from '../../helpers/ToolbarOptions'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useTagStore } from '../../hooks/store/useTagsStore'
import { useUploadImage } from '../../hooks/useUpload'
import useWindowSize from '../../hooks/useWindowSize'
import { showAlert } from '../common/Alert'
import BannerImg from '../common/BannerImg'
import { Switch } from '../common/Switch'

import { TagList } from './TagList'

const defaultImgUri =
    'https://res.cloudinary.com/hapmoniym/image/upload/v1644331126/bot-thk/no-image_eaeuge.jpg'

const ReactQuill = dynamic(
    () => import('react-quill').then((mod) => mod.default),
    {
        ssr: false,
    }
)

type DraftPayload = {
    id: string
    title: string
    body: string
    tags: string[]
    active: boolean
}

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
    const { t } = useTranslation('dashboard')
    const router = useRouter()
    const blogContainerRef = useRef<null | HTMLDivElement>(null)
    const queryClient = useQueryClient()

    const user = useAuthStore((state) => state.user)
    const imageInput = useRef<HTMLInputElement | null>(null)
    const [title, setTitle] = useState('')
    const [active, setActive] = useState(false)
    const { windowWidth } = useWindowSize()
    const isMobile = windowWidth && windowWidth < 900

    const listTags = useTagStore((state) => state.list)

    const [body, setBody] = useState<string>('')
    const [msg, setMsg] = useState('')
    const [err, setErr] = useState('')
    const { image, setImage, upload, error } = useUploadImage('', () => {
        if (image !== defaultImgUri) setShowBanner(true)
    })
    const [showBanner, setShowBanner] = useState(
        !!(image && image !== defaultImgUri) || false
    )

    const [showTags, setShowTags] = useState(!!draftTags?.length || false)
    const [selectedTags, setSelectedTags] = useState<string[]>(draftTags ?? [])

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setTitle(value)
    }

    const handleCancel = () => {
        if (formType === 'create') {
            localforage.setItem('temp-draft-content', body)
            localforage.setItem('temp-draft-title', title)
        }

        router.push({ pathname: '/dashboard' })
    }

    const handleContainerScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
        if (e.currentTarget.scrollTop > 10) setShowBanner(false)
    }

    const initCreateData = useCallback(async () => {
        const tempDraftTitle = (await localforage.getItem(
            'temp-draft-title'
        )) as string
        const tempDraftBody = (await localforage.getItem(
            'temp-draft-content'
        )) as string
        if (tempDraftBody) setBody(tempDraftBody)
        if (tempDraftTitle) setTitle(tempDraftTitle)
    }, [])

    const initEditData = useCallback(async (): Promise<DraftPayload | null> => {
        if (!blogId) return null
        console.log(blogId)
        try {
            const draftInIDB = (await localforage.getItem(
                `draft_${blogId}`
            )) as DraftPayload

            if (draftBody) setBody(draftBody)
            if (draftActive) setActive(draftActive)
            if (draftTitle) setTitle(draftTitle)
            if (draftImg) setImage(draftImg)
            if (draftTags) setSelectedTags(draftTags)
            return draftInIDB
        } catch (error) {
            console.log(error)
        }
        return null
    }, [
        blogId,
        draftActive,
        draftBody,
        draftImg,
        draftTags,
        draftTitle,
        setImage,
    ])

    const publishBlog = async () => {
        setActive(true)
        const blogInput: BlogInput = { body, title, active, imageUri: image }
        if (!blogInput.imageUri) {
            blogInput.imageUri = defaultImgUri
        }
        if (!blogInput.active) blogInput.active = true

        if (!selectedTags.length) {
            setMsg(t('add-label-tip'))
            return
        }

        if (formType === 'create') {
            const res = await sdk.CreateBlog({
                blogInput,
                tagIds: selectedTags,
            })
            if (!res.createBlog.success) {
                setErr(t('publish-fail-info'))
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
                    setErr(t('update fail info'))
                }
                queryClient.invalidateQueries({ queryKey: ['userBlogs'] })
                queryClient.invalidateQueries({
                    queryKey: ['getBlogById', blogId],
                })

                await localforage.setItem(`draft_${blogId}`, {
                    id: blogId,
                    title,
                    body,
                    tags: selectedTags,
                    active,
                })
                localforage.removeItem('temp-draft-title')
                localforage.removeItem('temp-draft-content')
            }
        }

        setTitle('')
        setImage('')
        setActive(false)
        setBody('')

        router.push({ pathname: '/dashboard' })
    }

    const saveBlog = async () => {
        const blogInput: BlogInput = {
            body,
            title,
            active,
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
                setErr(t('save-fail-info'))
            }

            const blogId = res.createBlog.blog?._id
            queryClient.invalidateQueries({ queryKey: ['userBlogs'] })
            if (blogId)
                await localforage.setItem(`draft_${blogId}`, {
                    id: blogId,
                    title,
                    body,
                    tags: selectedTags,
                    active,
                })

            localforage.setItem('temp-draft-title', title)
            localforage.setItem('temp-draft-content', body)
        } else if (formType === 'edit') {
            if (blogId) {
                const res = await sdk.UpdateBlog({
                    blogInput,
                    blogId: blogId,
                    tagIds: selectedTags,
                })

                if (!res.updateBlog.success) {
                    setErr(t('save-fail-info'))
                }

                queryClient.invalidateQueries({ queryKey: ['userBlogs'] })

                await localforage.setItem(`draft_${blogId}`, {
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
            initEditData().then((draftInIDB) => {
                if (draftInIDB) {
                    setTitle(draftInIDB.title)
                    setBody(draftInIDB.body)
                    setActive(draftInIDB.active)
                    setSelectedTags(draftInIDB.tags)
                }
            })
        }

        return () => {
            setBody('')
            setTitle('')
            setActive(false)
        }
        // eslint-disable-next-line
    }, [])

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
                        placeholder={t('title')}
                    />
                    <div className="separator"> / </div>
                    <div className="blog-form-icons">
                        <label
                            className="icon-btn"
                            title={t('edit-img')}
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
                                title={t('hide-img')}
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
                                    title={t('show-img')}
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
                    <Suspense>
                        <ReactQuill
                            modules={QuillModules}
                            formats={QuillFormats}
                            value={body}
                            placeholder={`${t('Start writing')}...`}
                            onChange={setBody}
                        />
                    </Suspense>
                </div>
                <div className="blog-form-bottom">
                    <div className="switch-group">
                        {active ? (
                            <MdOutlinePublic size={24} />
                        ) : (
                            <MdOutlinePublicOff
                                className="unpublic"
                                size={24}
                            />
                        )}
                        <Switch
                            isOn={active}
                            handleToggle={() => setActive(!active)}
                            colorOne="#1876d2"
                            colorTwo="#8eb8e8"
                        />
                    </div>
                    <div className="tags-form">
                        <button
                            type="button"
                            title={t('add-label')}
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
                            {isMobile ? (
                                <IoArrowBackCircleOutline size={20} />
                            ) : (
                                t('cancel')
                            )}
                        </button>
                        <button
                            type="button"
                            className="form-btn"
                            onClick={publishBlog}
                        >
                            {isMobile ? <BsSend size={16} /> : t('publish')}
                        </button>
                        <button
                            type="button"
                            className="form-btn"
                            onClick={saveBlog}
                        >
                            {isMobile ? <IoSaveOutline size={18} /> : t('save')}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
