import { useState } from 'react'
import classNames from 'classnames'

import MyBrand from '../../../components/common/MyBrand'
import { sdk } from '../../../generated/sdk'
import { getErrorMsg } from '../../../helpers/getErrorMsg'

const ForgotPassword = () => {
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
                error: '邮箱地址不得为空，请重新输入',
            })
        } else {
            setValues({ ...values, message: '', error: '' })
            sdk.ForgotPassword({ email })
                .then((res) => {
                    console.log(res)
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

    const showError = () =>
        error ? (
            <div
                className="error"
                style={{ marginBottom: '16px', transform: 'easein 200ms' }}
            >
                {error}
            </div>
        ) : (
            ''
        )
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
                    placeholder="请输入账号邮箱"
                    required
                />
            </div>
            <button className="form-btn">发送验证链接</button>
        </form>
    )

    return (
        <div className="sign">
            <div className="sign-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <h2 className="sign-title" style={{ margin: '50px auto' }}>
                    忘记了密码？
                </h2>
                {error && showError()}
                {message && showMessage()}
                {showForm && passwordForgotForm()}
            </div>
        </div>
    )
}

export default ForgotPassword
