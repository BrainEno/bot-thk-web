import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { NextRouter, useRouter, withRouter } from 'next/router'
import { getCookie, isAuth } from '../../actions/auth'
import { listCategories } from '../../actions/category'
import { listTags } from '../../actions/tag'
import { singleBlog, updateBlog } from '../../actions/blog'
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
})
import { UploadOutlined } from '@ant-design/icons'
import { QuillModules, QuillFormats } from '../../helpers/quill'
import SlideImage from '../SlideImage'
import { ICategory, ITag } from '../../types'

const BlogUpdate = ({ router }: { router: NextRouter }) => {
    const myRouter = useRouter()
    const [body, setBody] = useState('')

    const [categories, setCategories] = useState<ICategory[]>([])
    const [tags, setTags] = useState<ITag[]>([])

    const [checkedCats, setCheckedCats] = useState<string[]>([])
    const [checkedTags, setCheckedTags] = useState<string[]>([])

    const [values, setValues] = useState<{
        title: string
        error: string
        successMsg: string
        formData: null | FormData
        body: string
    }>({
        title: '',
        error: '',
        successMsg: '',
        formData: null,
        body: '',
    })

    const { error, successMsg, formData, title } = values
    const token = getCookie('token')

    useEffect(() => {
        setValues({ ...values, formData: new FormData() })
        initBlog()
        initCategories()
        initTags()
    }, [router])

    const initBlog = () => {
        if (router.query.id) {
            singleBlog(router.query.id).then((data) => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    setValues({ ...values, title: data.title })
                    setBody(data.body)
                    setCategoriesArray(data.categories)
                    setTagsArray(data.tags)
                }
            })
        }
    }

    const setCategoriesArray = (blogCategories: ICategory[]) => {
        let ca: string[] = []
        blogCategories.map((c) => {
            ca.push(c._id)
        })
        setCheckedCats(ca)
    }

    const setTagsArray = (blogTags: ITag[]) => {
        let ta: string[] = []
        blogTags.map((t) => {
            ta.push(t._id)
        })
        setCheckedTags(ta)
    }

    const initCategories = () => {
        listCategories().then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setCategories(data)
            }
        })
    }

    const initTags = () => {
        listTags().then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setTags(data)
            }
        })
    }

    const handleToggle = (catId: string) => () => {
        setValues({ ...values, error: '' })
        const clickedCategory = checkedCats.indexOf(catId)
        const all = [...checkedCats]

        if (clickedCategory === -1) {
            all.push(catId)
        } else {
            all.splice(clickedCategory, 1)
        }

        setCheckedCats(all)
        formData!.set('categories', all.toString())
    }

    const handleTagsToggle = (t: string) => () => {
        setValues({ ...values, error: '' })
        const clickedTag = checkedTags.indexOf(t)
        const all = [...checkedTags]

        if (clickedTag === -1) {
            all.push(t)
        } else {
            all.splice(clickedTag, 1)
        }
        console.log(all)
        setCheckedTags(all)
        formData!.set('tags', all.toString())
    }

    const findOutCategory = (c: string) => {
        const result = checkedCats.indexOf(c)
        if (result !== -1) {
            return true
        } else {
            return false
        }
    }

    const findOutTag = (t: string) => {
        const result = checkedTags.indexOf(t)
        if (result !== -1) {
            return true
        } else {
            return false
        }
    }

    const showCategories = () => {
        return (
            categories &&
            categories.map((c, i) => (
                <li key={i} className="checkbox-group">
                    <input
                        type="checkbox"
                        onChange={handleToggle(c._id)}
                        checked={findOutCategory(c._id)}
                        className="mr-2"
                    />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags &&
            tags.map((t, i) => (
                <li key={i} className="checkbox-group">
                    <input
                        type="checkbox"
                        onChange={handleTagsToggle(t._id)}
                        checked={findOutTag(t._id)}
                        className="mr-2"
                    />
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        )
    }

    const handleChange =
        (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            console.log(e.target.value)
            const value = name === 'image' ? e.target.files![0] : e.target.value
            formData!.set(name, value)
            setValues({ ...values, [name]: value, formData, error: '' })
        }

    const handleBody = (e: string) => {
        setBody(e)
        formData!.set('body', e)
    }

    const editBlog: React.FormEventHandler = (e) => {
        e.preventDefault()
        console.log(router.query.id)
        updateBlog(formData, token, router.query.id).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            } else {
                setValues({
                    ...values,
                    title: '',
                    successMsg: `您的文章《${data.title}》已成功更新`,
                })
                if (isAuth() && isAuth().role === 1) {
                    myRouter.replace(`/admin`)
                } else if (isAuth() && isAuth().role === 0) {
                    myRouter.replace(`/user`)
                }
            }
        })
    }

    const showError = () => (
        <div className="alert" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div
            className="alert alert-successMsg"
            style={{ display: successMsg ? '' : 'none' }}
        >
            {successMsg}
        </div>
    )

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
                <div className="input-container">
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={handleChange('title')}
                        placeholder="Post title"
                    />
                </div>
                <div className="form-group">
                    <ReactQuill
                        modules={QuillModules}
                        formats={QuillFormats}
                        value={body}
                        placeholder="开始创作..."
                        onChange={handleBody}
                    />
                </div>
                <div className="btn-container">
                    <button type="submit" className="form-btn my-3 right">
                        更新文章
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className="blog-update-container">
            <div className="blogUpdate-form">
                {body && (
                    <div style={{ marginBottom: '20px' }}>
                        <SlideImage imgSrc={`/blog/image/${router.query.id}`} />
                    </div>
                )}
                {error && showError()}
                {successMsg && showSuccess()}
                <div className="blog-form-container">{updateBlogForm()}</div>
            </div>
            <div className="right-container">
                <div className="upload-pic">
                    <div>
                        <h5>
                            配图{' '}
                            <small className="text-muted">{`(<1MB)`}</small>
                        </h5>
                        <hr />
                        <label className="upload-btn">
                            <UploadOutlined />
                            更换图片
                            <input
                                type="file"
                                onChange={handleChange('image')}
                                accept="image/*"
                                hidden
                            />
                        </label>
                    </div>
                </div>
                <div>
                    <h5>
                        分类 <small className="text-muted">{`(必选)`}</small>
                    </h5>
                    <hr />
                    <ul>{showCategories()}</ul>
                </div>
                <div>
                    <h5>
                        标签 <small className="text-muted">{`(必选)`}</small>
                    </h5>
                    <hr />
                    <ul>{showTags()}</ul>
                </div>
            </div>
        </div>
    )
}

export default withRouter(BlogUpdate)
