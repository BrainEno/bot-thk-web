import { useState } from 'react'
import dynamic from 'next/dynamic'

import { BlogInput, getSdk } from '../../gql/sdk';
import { gqlClient } from '../../graphql/gqlClient';

const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
})

export type FormType = 'create' | 'edit'

interface BlogFormProps {
    formType: FormType
}

const sdk=getSdk(gqlClient);

export const BlogForm = ({ formType }: FormType) => {
    const {blog,setBlog}=useState<BlogInput>({body:'',title:'',description:'',active:false,})
    const saveBlog = () => []

    const publishBlog = () => {}

    return (
        <div className="blog-form-container">
            <form onSubmit={publishBlog}>
                <div className="input-container">
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        name="title"
                        onChange={handleChange}
                        placeholder="输入题目..."
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
                    <button className="form-btn">保存草稿</button>
                    <button type="submit" className="form-btn">
                        发布文章
                    </button>
                </div>
            </form>
        </div>
    )
}
