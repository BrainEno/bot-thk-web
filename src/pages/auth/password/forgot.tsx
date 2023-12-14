import { useState } from 'react'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { showAlert } from '../../../components/common/Alert'
import MyBrand from '../../../components/common/MyBrand'
import { sdk } from '../../../generated/sdk'
import { getErrorMsg } from '../../../helpers/getErrorMsg'
import { ServerSideTranslations } from '../../../types'

const ForgotPassword = () => {
    const { t, i18n } = useTranslation('account')
    const isZh = i18n.language === 'zh'

    const [values, setValues] = useState({
        email: '',
        message: '',
        error: '',
        showForm: true,
    })

    const { email, message, error, showForm } = values

    const handleChange =
        (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setValues({
                ...values,
                message: '',
                error: '',
                [name]: e.target.value,
            })
        }

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()
        if (values.email.trim() === '') {
            setValues({
                ...values,
                message: '',
                error: t('Email Required'),
            })
        } else {
            setValues({ ...values, message: '', error: '' })
            sdk.ForgotPassword({ email })
                .then((res) => {
                    // console.log(res)
                    setValues({
                        ...values,
                        message: res.forgotPassword,
                        email: '',
                        showForm: false,
                    })
                })
                .catch((err) => {
                    const errMsg = getErrorMsg(err)
                    setValues({ ...values, error: errMsg })
                })
        }
    }

    const passwordForgotForm = () => (
        <form onSubmit={handleSubmit} className="sign-form">
            <div className="form-group">
                <input
                    type="email"
                    onChange={handleChange('email')}
                    className={classNames('form-input', {
                        error: error,
                        isInvalid: error,
                    })}
                    value={email}
                    placeholder={t('Enter Email')}
                    required
                />
            </div>
            <button className="form-btn">{t('Send Link')}</button>
        </form>
    )

    return (
        <div className="sign">
            <div className="sign-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <h2 className="sign-title" style={{ margin: '50px auto' }}>
                    {isZh ? '忘记了密码？' : 'Fogot your password?'}
                </h2>
                {error && showAlert(error, 'error')}
                {message && showAlert(message, 'warn')}
                {showForm && passwordForgotForm()}
            </div>
        </div>
    )
}

export default ForgotPassword

export const getServerSideProps: GetServerSideProps<
    ServerSideTranslations
> = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', [
                'common',
                'account',
            ])),
        },
    }
}
