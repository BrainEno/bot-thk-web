import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { sdk } from '../../generated/sdk'
import { gqlClient } from '../../graphql/gqlClient'
import { useAuthStore } from '../../hooks/store/useAuthStore'

const SignupComponent = () => {
    const { user, auth } = useAuthStore()
    const isAuth = useMemo(() => !!user, [user])
    const router = useRouter()
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        loading: false,
        message: '',
        showForm: true,
    })

    const [errors, setErrors] = useState<{
        username: string
        email: string
        password: string
    }>({
        username: '',
        email: '',
        password: '',
    })

    const { name, email, password, loading, message, showForm } = values

    useEffect(() => {
        isAuth && router.push('/')
    }, [isAuth, router])

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()
        setErrors({ username: '', email: '', password: '' })
        if (values.name.trim() === '') {
            setErrors({ ...errors, username: '用户名不得为空，请重新输入' })
            setValues({
                ...values,
                loading: false,
            })
        } else if (values.email.trim() === '') {
            setErrors({ ...errors, email: '邮箱地址不得为空，请重新输入' })
            setValues({
                ...values,
                loading: false,
            })
        } else if (values.password.trim() === '') {
            setErrors({ ...errors, password: '密码不得为空，请重新输入' })
            setValues({
                ...values,
                loading: false,
            })
        } else {
            setValues({ ...values, loading: true })

            sdk.Register({
                registerName: name,
                registerEmail: email,
                registerPassword: password,
            })
                .then(async(res) => {
                    const { register: token } = res

                    if (token && token !== '') {
                        setValues({
                            ...values,
                            name: '',
                            email: '',
                            password: '',
                            loading: false,
                            message: '注册成功,即将跳转到首页',
                            showForm: false,
                        })
                        gqlClient.setHeader('authorization', `Bearer ${token}`)

                        await auth()
                    }
                })
                .catch((err: any) => {
                    if (err.response && err.response.errors) {
                        console.log(Object.keys(err.response))

                        const errs = err.response.errors
                        errs.forEach((err: any) => {
                            console.log('trace', err)
                            const { code } = err.extensions
                            if (code === 'INVALID_EMAIL') {
                                setErrors({ ...errors, email: err.message })
                            } else if (code === 'INVALID_USERNAME') {
                                setErrors({ ...errors, username: err.message })
                            }
                        })
                        setValues({ ...values, loading: false, message: '' })
                    }
                    setValues({
                        ...values,
                        loading: false,
                        message: '请求超时，请稍后重试',
                    })
                })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const name = e.target.name
        setValues({ ...values, [name]: value })
        setErrors({ username: '', email: '', password: '' })
    }

    const showLoading = () =>
        loading ? <div className="alert alert-info">Loading...</div> : ''

    const showMessage = () =>
        message ? (
            <div
                style={{
                    width: '70%',
                    margin: '20px auto',
                    wordBreak: 'break-all',
                }}
            >
                <h3>{message}</h3>
            </div>
        ) : (
            ''
        )

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit} className="sign-form">
                <div className="form-group">
                    <label
                        htmlFor="inputUsername"
                        className={classNames({ error: errors.username })}
                    >
                        {errors.username || '用户名'}
                    </label>
                    <input
                        id="inputUsername"
                        type="text"
                        name="name"
                        className={classNames('form-input', {
                            isInvalid: errors.username,
                            error: errors.username,
                        })}
                        value={name}
                        onChange={handleChange}
                        placeholder="请输入您的用户名"
                    />
                </div>
                <div className="form-group">
                    <label
                        htmlFor="inputEmail"
                        className={classNames({ error: errors.email })}
                    >
                        {errors.email || '邮箱'}
                    </label>
                    <input
                        id="inputEmail"
                        className={classNames('form-input', {
                            isInvalid: errors.email,
                            error: errors.email,
                        })}
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="请输入您的邮箱"
                    />
                </div>
                <div className="form-group">
                    <label
                        htmlFor="inputPasword"
                        className={classNames({ error: errors.password })}
                    >
                        {errors.password || '密码'}
                    </label>
                    <input
                        id="inputPassword"
                        type="password"
                        className={classNames('form-input', {
                            error: errors.password,
                            isInvalid: errors.password,
                        })}
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="请输入您的密码"
                    />
                </div>
                <button className="form-btn">注册</button>
            </form>
        )
    }

    return (
        <>
            {showLoading()}
            {showMessage()}
            {showForm && signupForm()}
            <Link href="/auth/password/forgot" passHref>
                <span
                    style={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        color: '#0879bf !important',
                        margin: '5px 0 20px',
                    }}
                >
                    忘记密码
                </span>
            </Link>
        </>
    )
}

export default SignupComponent
