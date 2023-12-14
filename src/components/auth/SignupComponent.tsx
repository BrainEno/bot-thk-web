import React, { useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import { sdk } from '../../generated/sdk'
import { gqlClient } from '../../graphql/gqlClient'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { showAlert } from '../common/Alert'

const SignupComponent = () => {
    const { t, i18n } = useTranslation('account')
    const isZh = i18n.language === 'zh'
    const { user, setUser } = useAuthStore()
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
            setErrors({ ...errors, username: t('Username Required') })
            setValues({
                ...values,
                loading: false,
            })
        } else if (values.email.trim() === '') {
            setErrors({ ...errors, email: t('Email Required') })
            setValues({
                ...values,
                loading: false,
            })
        } else if (values.password.trim() === '') {
            setErrors({ ...errors, password: t('Password Required') })
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
                .then(async (res) => {
                    const { register: token } = res

                    if (token && token !== '') {
                        setValues({
                            ...values,
                            name: '',
                            email: '',
                            password: '',
                            loading: false,
                            message: isZh
                                ? '注册成功,即将跳转到首页'
                                : 'Success!',
                            showForm: false,
                        })
                        gqlClient.setHeader('authorization', `Bearer ${token}`)

                        await setUser()
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
                        message: t('Unkwon Error'),
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

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit} className="sign-form">
                <div className="form-group">
                    <label
                        htmlFor="inputUsername"
                        className={classNames({ error: errors.username })}
                    >
                        {errors.username || t('Username')}
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
                        placeholder={t('Enter Username')}
                    />
                </div>
                <div className="form-group">
                    <label
                        htmlFor="inputEmail"
                        className={classNames({ error: errors.email })}
                    >
                        {errors.email || t('Email')}
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
                        placeholder={t('Enter Email')}
                    />
                </div>
                <div className="form-group">
                    <label
                        htmlFor="inputPasword"
                        className={classNames({ error: errors.password })}
                    >
                        {errors.password || t('Password')}
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
                        placeholder={t('Enter Password')}
                    />
                </div>
                <button className="form-btn">{t('Register')}</button>
            </form>
        )
    }

    return (
        <>
            {loading && showAlert(`${t('Loading')}...`, 'info')}
            {message && showAlert(message, 'warn')}
            {showForm && signupForm()}
            <Link className="forgot-password" href="/auth/password/forgot">
                {t('Forgot Password')}
            </Link>
        </>
    )
}

export default SignupComponent
