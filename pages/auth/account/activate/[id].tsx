import React, { useState, useEffect, useCallback } from 'react'
import jwt from 'jsonwebtoken'
import { NextRouter, withRouter } from 'next/router'
import { signup } from '../../../../actions/auth'

const ActivateAccount = ({ router }: { router: NextRouter }) => {
    const [values, setValues] = useState<{
        name: string
        token: string
        error: any
        loading: boolean
        success: boolean
        showButton: boolean
    }>({
        name: '',
        token: '',
        error: '',
        loading: false,
        success: false,
        showButton: true,
    })

    const { name, token, error, loading, success, showButton } = values
    const setToken = useCallback(() => {
        let token: string = router.query.id as string
        if (token) {
            const { name } = jwt.decode(token) as { name: string }
            setValues((values) => ({ ...values, name, token }))
        }
    }, [router.query.id])

    useEffect(() => {
        setToken()
    }, [router, setToken])

    const clickSubmit = (event: React.MouseEvent): void => {
        event.preventDefault()
        setValues({ ...values, loading: true, error: false })
        signup({ token }).then((data) => {
            if (data.error) {
                setValues({
                    ...values,
                    error: data.error,
                    loading: false,
                    showButton: false,
                })
            } else {
                setValues({
                    ...values,
                    loading: false,
                    success: true,
                    showButton: false,
                })
            }
        })
    }

    const showLoading = () => (loading ? <h2>Loading...</h2> : '')

    return (
        <div className="sign">
            <div className="sign-container">
                <div className="container">
                    {showLoading()}
                    {error && error}
                </div>
                {success ? (
                    <h3>Hi, {name}!你的账号已激活！Let&apos;s Jam！</h3>
                ) : (
                    <h3 className="pb-4 text-center">
                        你好, {name}！准备好激活你的账号了吗？
                    </h3>
                )}
                {showButton && (
                    <button className="form-btn" onClick={clickSubmit}>
                        激活账户
                    </button>
                )}
            </div>
        </div>
    )
}

export default withRouter(ActivateAccount)
