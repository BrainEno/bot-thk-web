import { useState } from 'react'
import classNames from 'classnames'
import { GetServerSideProps } from 'next'
import { NextRouter, withRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { showAlert } from '../../../../components/common/Alert'
import MyBrand from '../../../../components/common/MyBrand'
import { sdk } from '../../../../generated/sdk'
import { ServerSideTranslations } from '../../../../types'

const ResetPassword = ({ router }: { router: NextRouter }) => {
    const { t, i18n } = useTranslation('account')
    const isZh = i18n.language === 'zh'

    const [values, setValues] = useState({
        newPassword: '',
        error: '',
        message: '',
        showForm: true,
    })

    const { showForm, newPassword, error, message } = values

    const handleSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()
        sdk.ResetPassword({
            password: newPassword,
            username: router.query.id as string,
        }).then((success) => {
            if (!success) {
                setValues({
                    ...values,
                    error: isZh
                        ? '重置密码失败，请重试'
                        : 'Reset failed,please try again',
                    showForm: false,
                    newPassword: '',
                })
            } else {
                setValues({
                    ...values,
                    message: isZh
                        ? '密码已重置'
                        : 'Your password has been reset successfully',
                    showForm: false,
                    newPassword: '',
                    error: '',
                })
            }
        })
    }

    const passwordResetForm = () => (
        <form onSubmit={handleSubmit} className="sign-form">
            <div className="form-group">
                <input
                    type="password"
                    onChange={(e) =>
                        setValues({ ...values, newPassword: e.target.value })
                    }
                    className={classNames('form-input', {
                        error: error,
                        isInvalid: error,
                    })}
                    value={newPassword}
                    placeholder={isZh ? '请输入新的密码' : 'New Password'}
                    required
                />
            </div>
            <button className="form-btn">{t('Reset Password')}</button>
        </form>
    )

    return (
        <div className="sign">
            <div className="sign-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <h2 className="sign-title" style={{ margin: '50px auto' }}>
                    {isZh ? '重新设置密码' : 'Reset my password'}
                </h2>
                {error && showAlert(error, 'error')}
                {message && showAlert(message, 'warn')}
                {showForm && passwordResetForm()}
            </div>
        </div>
    )
}

export default withRouter(ResetPassword)

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
