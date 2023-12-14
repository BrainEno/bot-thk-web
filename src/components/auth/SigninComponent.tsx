import React from 'react'
import { useState } from 'react'
import classNames from 'classnames'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useTranslation } from 'next-i18next'

import { showAlert } from '../common/Alert'

const SigninComponent = () => {
    const { t } = useTranslation('account')

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
                email: t('Email Required'),
            })
            setValues({
                ...values,
                loading: false,
            })
        } else if (values.password.trim() === '') {
            setErrors({
                ...errors,
                email: '',
                password: t('Password Required'),
            })
            setValues({
                ...values,
                loading: false,
            })
        } else {
            setValues({ ...values, loading: true, message: '' })
            signIn('credentials', { email, password, redirect: false })
                .then((res) => {
                    if (res?.status === 401) {
                        setValues({
                            ...values,
                            loading: false,
                            message: t('Auth Error'),
                        })
                    }
                })
                .catch((err: any) => {
                    if (err)
                        setValues({
                            ...values,
                            loading: false,
                            message: t('Unkown Error'),
                        })
                })
        }
    }

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit} className="sign-form">
                <div className="form-group">
                    <label
                        htmlFor="inputEmail"
                        className={classNames({ error: !!errors.email })}
                    >
                        {errors.email || t('Email')}
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
                        placeholder={t('Enter Email')}
                    />
                </div>
                <div className="form-group">
                    <label
                        htmlFor="inputPassword"
                        className={classNames({ error: !!errors.password })}
                    >
                        {errors.password || t('Password')}
                    </label>
                    <input
                        id="inputPassword"
                        type="password"
                        className={classNames('form-input', {
                            isInvalid: !!errors.password,
                            error: !!errors.password,
                        })}
                        name="password"
                        value={password}
                        onChange={handleChange}
                        placeholder={t('Enter Password')}
                    />
                </div>
                <button type="submit" className="form-btn">
                    {t('Login')}
                </button>
            </form>
        )
    }

    return (
        <>
            {loading && showAlert(`${t('Loading')}...`, 'info')}
            {message && showAlert(message, 'warn')}
            {showForm && signinForm()}
            <Link href="/auth/password/forgot" className="forgot-password">
                {t('Forgot Password')}
            </Link>
        </>
    )
}

export default SigninComponent
