import React, { useState, useEffect, useCallback } from 'react'
import MyBrand from '../MyBrand'
import Avatar from '../profile/Avatar'
import { getCookie, isAuth, updateUser } from '../../actions/auth'
import { getProfile, update } from '../../actions/user'
import { UploadOutlined } from '@ant-design/icons'

const ProfileUpdate = () => {
    const [values, setValues] = useState<{
        username: string
        name: string
        email: string
        about: string
        password: string
        error: boolean
        success: boolean
        loading: boolean
        photo: string
        userData: null | FormData
    }>({
        username: '',
        name: '',
        email: '',
        about: '',
        password: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
        userData: null,
    })

    const token = getCookie('token')
    const {
        username,
        name,
        email,
        password,
        about,
        error,
        success,
        loading,
        userData,
    } = values

    const init = useCallback(() => {
        getProfile(token).then((data) => {
            if (data.error) {
                setValues((values) => ({ ...values, error: data.error }))
            } else {
                setValues((values) => ({
                    ...values,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    about: data.about,
                }))
            }
        })
    }, [token])

    useEffect(() => {
        isAuth()
        if (isAuth()) init()
    }, [init])

    const handleChange =
        (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = name === 'photo' ? e.target.files![0] : e.target.value

            let userFormData = new FormData()
            userFormData.set(name, value)
            setValues({
                ...values,
                [name]: value,
                userData: userFormData,
                error: false,
                success: false,
            })
            alert('图片已上传，点击提交保存更改')
        }

    const handleSubmit: React.FormEventHandler = (
        e: React.FormEvent<HTMLInputElement>
    ) => {
        e.preventDefault()
        setValues({ ...values, loading: true })
        update(token, userData).then((data) => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    success: false,
                    loading: false,
                })
            } else {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        password: '',
                        success: true,
                        loading: false,
                    })
                })

                setTimeout(() => {
                    setValues({
                        ...values,
                        success: false,
                    })
                }, 1000)
            }
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
                <label>密码</label>
                <input
                    type="password"
                    onChange={handleChange('password')}
                    value={password}
                    className="form-input"
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
                        {username.length > 0 && (
                            <Avatar
                                src={`${process.env.NEXT_PUBLIC_API}/user/photo/${username}`}
                                size={150}
                                radius={150}
                            />
                        )}
                    </div>
                    <div className="form-group">
                        <label className="btn">
                            <UploadOutlined
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
