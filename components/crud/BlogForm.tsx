import { useEffect, useRef, useState } from 'react'
import { BsTags } from 'react-icons/bs'
import { GrImage } from 'react-icons/gr'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import { BlogInput, getSdk } from '../../gqlSDK/sdk'
import { gqlClient } from '../../graphql/gqlClient'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import { QuillFormats, QuillModules } from '../../helpers/quillConfig'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useTagStore } from '../../hooks/store/useTagsStore'
import BannerImg from '../BannerImg'
import { showAlert } from '../Common/Alert'

import { TagList } from './TagList'

const defaultImgUri =
    'https://res.cloudinary.com/hapmoniym/image/upload/v1644331126/bot-thk/no-image_eaeuge.jpg'

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
})

export type FormType = 'create' | 'edit'

interface BlogFormProps {
    formType: FormType
    draftTitle?: string
    draftBody?: string
    draftImg?: string
    draftActive?: boolean
}

const sdk = getSdk(gqlClient)

export const BlogForm = ({ formType }: BlogFormProps) => {
    const router = useRouter()
    const user = useAuthStore((state) => state.user)
    const imgInput = useRef<HTMLInputElement | null>(null)
    const [blog, setBlog] = useState<Omit<BlogInput, 'body'>>({
        title: '',
        active: false,
        imageUri: '',
    })

    const listTags = useTagStore((state) => state.list)

    const [body, setBody] = useState<string>('')
    const [error, setError] = useState('')

    const [showTags, setShowTags] = useState(false)
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setBlog({ ...blog, title: value })
    }

    const uploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target

        if (!files || !files[0]) return
        const url = process.env.NEXT_PUBLIC_CLOUDINARY_URI!
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME!

        const formData = new FormData()
        formData.append('file', files[0])
        formData.append('upload_preset', preset)
        formData.append('cloud_name', cloudName)

        console.log(url, preset, cloudName)
        fetch(url, { method: 'POST', body: formData })
            .then((res) => res.json())
            .then((data) => {
                console.log('data', data)
                const imageUri = data.secure_url

                console.log(imageUri)
                setBlog({ ...blog, imageUri })
            })
            .catch((error) => {
                const errMsg = getErrorMsg(error)
                setError(errMsg)
            })
    }

    const saveBlog = () => {
        console.log('save')
        localStorage.setItem('draft-content', body)
        localStorage.setItem('draft-title', title)
    }

    const publishBlog = async () => {
        if (formType === 'create') {
            const blogInput = Object.assign(blog, { body })
            if (!blogInput.imageUri) {
                blogInput.imageUri = defaultImgUri
            }
            blogInput.active = true

            await sdk.CreateBlog({ blogInput, tagIds: selectedTags })
        } else if (formType === 'edit') {
            const blogInput = Object.assign(blog, { body })

            console.log(blogInput)
        }
        setBlog({
            title: '',
            active: false,
            imageUri: '',
        })

        setBody('')
    }

    const handleTags = () => {
        setShowTags(!showTags)
    }

    const { title } = blog

    useEffect(() => {
        if (!user) {
            router.push('/signin')
        }
    }, [router, user])

    useEffect(() => {
        listTags()
    }, [listTags])

    return (
        <div className="blog-form-container">
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
                            title="插入图片"
                            htmlFor="blog-image"
                        >
                            <input
                                type="file"
                                id="blog-image"
                                accept="image/*"
                                hidden
                                ref={imgInput}
                                onChange={uploadImg}
                            />
                            <GrImage />
                        </label>
                    </div>
                </div>

                <div className="body-container">
                    {blog.imageUri && <BannerImg imgSrc={blog.imageUri} />}
                    <ReactQuill
                        modules={QuillModules}
                        formats={QuillFormats}
                        value={body}
                        placeholder="开始创作..."
                        onChange={setBody}
                    />
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
                        {showTags && (
                            <TagList
                                selectedTags={selectedTags}
                                setSelectedTags={setSelectedTags}
                            />
                        )}
                    </div>
                    <div>
                        <button
                            className="form-btn"
                            type="button"
                            onClick={saveBlog}
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
                    </div>
                </div>
            </form>
        </div>
    )
}
