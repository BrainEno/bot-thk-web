import { useState } from 'react'
import classNames from 'classnames'
import { NextRouter, withRouter } from 'next/router'

import MyBrand from '../../../../components/MyBrand'
import { sdk } from '../../../../gqlSDK'

const ResetPassword = ({ router }: { router: NextRouter }) => {
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
                    error: '重置密码失败，请重试',
                    showForm: false,
                    newPassword: '',
                })
            } else {
                setValues({
                    ...values,
                    message: '密码已重置',
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
                    placeholder="请输入新的密码"
                    required
                />
            </div>
            <button className="form-btn">修改密码</button>
        </form>
    )

    const showError = () => (error ? <h1 className="error">{error}</h1> : '')
    const showMessage = () =>
        message ? (
            <div
                style={{
                    width: '70%',
                    margin: '20px auto',
                    wordBreak: 'break-all',
                    textAlign: 'center',
                }}
            >
                <h3>{message}</h3>
            </div>
        ) : (
            ''
        )

    return (
        <div className="sign">
            <div className="sign-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <h2 className="sign-title" style={{ margin: '50px auto' }}>
                    重新设置密码
                </h2>
                {error && showError()}
                {message && showMessage()}
                {showForm && passwordResetForm()}
            </div>
        </div>
    )
}

export default withRouter(ResetPassword)
