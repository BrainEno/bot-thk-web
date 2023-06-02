import React, { useState } from 'react'
import { FiUpload } from 'react-icons/fi'

import { sdk } from '../../gqlSDK'
import Avatar from '../Avatar'
import MyBrand from '../MyBrand'

const ProfileUpdate = () => {
    const [values, setValues] = useState<{
        name: string
        email: string
        about: string
        error: boolean
        success: boolean
        loading: boolean
        photo: string
    }>({
        name: '',
        email: '',
        about: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
    })

    const { name, email, about, photo, error, success, loading } = values

    const handleChange =
        (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = name === 'photo' ? e.target.files![0] : e.target.value

            const userFormData = new FormData()
            userFormData.set(name, value)
            setValues({
                ...values,
                [name]: value,
                error: false,
                success: false,
            })
            alert('图片已上传，点击提交保存更改')
        }

    const handleSubmit: React.FormEventHandler = (
        e: React.FormEvent<HTMLInputElement>
    ) => {
        e.preventDefault()
        sdk.EditProfile({ name, email, about }).then(() => {
            setValues({ ...values, loading: true })
        })
    }

    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
                <label>用户名</label>
                <input
                    type="text"
                    onChange={handleChange('name')}
                    value={name}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    onChange={handleChange('email')}
                    value={email}
                    className=" form-input"
                />
            </div>
            <div className="form-group">
                <label>About</label>
                <textarea
                    onChange={handleChange('about') as any}
                    value={about}
                    className=" about-input"
                />
            </div>
            <button type="submit" className="form-btn">
                提交
            </button>
        </form>
    )

    const showError = () => (
        <div
            className="alert alert-danger"
            style={{ display: error ? '' : 'none' }}
        >
            {error}
        </div>
    )

    const showSuccess = () => (
        <div
            className="alert alert-success"
            style={{ display: success ? '' : 'none' }}
        >
            档案更新成功
        </div>
    )

    const showLoading = () => (
        <div
            className="alert alert-info"
            style={{ display: loading ? '' : 'none' }}
        >
            loading...
        </div>
    )

    return (
        <>
            <div className="update-container">
                <div className="avatar-update">
                    <div className="avatar-container">
                        <Avatar src={photo} size={150} radius={150} />
                    </div>
                    <div className="form-group">
                        <label className="btn">
                            <FiUpload
                                style={{ fontSize: '25px', marginRight: '5px' }}
                            />{' '}
                            更换头像
                            <input
                                type="file"
                                onChange={handleChange('photo')}
                                accept="image/*"
                                hidden
                            />
                        </label>
                    </div>
                </div>
                <div className="form-container">
                    {showSuccess()}
                    {showError()}
                    {showLoading()}
                    <div className="brand-container">
                        <MyBrand width={45} height={45} fontSize={'24px'} />
                    </div>
                    <h2 className="sign-title">修改个人信息</h2>
                    {profileUpdateForm()}
                </div>
            </div>
        </>
    )
}

export default ProfileUpdate
