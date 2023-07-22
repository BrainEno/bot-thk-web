import React, { useEffect } from 'react'
import { useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { sdk } from '../../generated/sdk'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { showAlert } from '../Common/Alert'

const SigninComponent = () => {
    const user = useAuthStore((state) => state.user)
    const auth = useAuthStore((state) => state.auth)

    const router = useRouter()
    const [values, setValues] = useState({
        email: '',
        password: '',
        loading: false,
        message: '',
        showForm: true,
    })
    const [errors, setErrors] = useState<{
        email: string
        password: string
    }>({
        email: '',
        password: '',
    })

    const { email, password, message, loading, showForm } = values

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name
        const value = e.target.value
        setValues({ ...values, [name]: value, message: '' })
    }

    const handleSubmit: React.FormEventHandler = (
        e: React.FormEvent<HTMLInputElement>
    ) => {
        e.preventDefault()
        setErrors({ email: '', password: '' })
        if (values.email.trim() === '') {
            setErrors({
                ...errors,
                password: '',
                email: '邮箱地址不得为空，请重新输入',
            })
            setValues({
                ...values,
                loading: false,
            })
        } else if (values.password.trim() === '') {
            setErrors({
                ...errors,
                email: '',
                password: '密码不得为空，请重新输入',
            })
            setValues({
                ...values,
                loading: false,
            })
        } else {
            setValues({ ...values, loading: true, message: '' })

            sdk.Login({ email, password })
                .then((res) => {
                    if (res.login.ok) {
                        auth()
                    }
                })
                .catch((err: any) => {
                    if (err.response && err.response.errors) {
                        console.log(Object.keys(err.response))

                        const errs = err.response.errors
                        errs.forEach((err: any) => {
                            const { code } = err.extensions
                            if (code === 'INVALID_EMAIL') {
                                setErrors({ ...errors, email: err.message })
                            } else if (code === 'INVALID_PASSWORD') {
                                setErrors({ ...errors, password: err.message })
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

    useEffect(() => {
        if (user && user._id) {
            setTimeout(() => router.push('/dashboard'), 500)
        }
    }, [router, user])

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit} className="sign-form">
                <div className="form-group">
                    <label
                        htmlFor="inputEmail"
                        className={classNames({ error: !!errors.email })}
                    >
                        {errors.email || '邮箱'}
                    </label>
                    <input
                        id="inputEmail"
                        className={classNames('form-input', {
                            isInvalid: !!errors.email,
                            error: !!errors.email,
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
                        htmlFor="inputEmail"
                        className={classNames({ error: !!errors.password })}
                    >
                        {errors.password || '密码'}
                    </label>
                    <input
                        type="password"
                        className={classNames('form-input', {
                            isInvalid: !!errors.password,
                            error: !!errors.password,
                        })}
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder="请输入您的密码"
                    />
                </div>
                <button type="submit" className="form-btn">
                    登 录
                </button>
            </form>
        )
    }

    return (
        <>
            {loading && showAlert('正在加载...', 'info')}
            {message && showAlert(message, 'warn')}
            {showForm && signinForm()}
            <Link href="/auth/password/forgot" passHref>
                <span
                    style={{
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        color: '#0879bf !important',
                        margin: '10px 0 25px',
                    }}
                >
                    忘记密码
                </span>
            </Link>
        </>
    )
}

export default SigninComponent
