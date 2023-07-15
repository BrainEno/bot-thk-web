import Link from 'next/link'

import SignupComponent from '../components/auth/SignupComponent'
import MyBrand from '../components/MyBrand'

const Signup = () => {
    return (
        <div className="sign">
            <div className="sign-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <h2 className="sign-title">新用户注册</h2>
                <p>
                    已经有账号了？点击
                    <Link href="/signin" passHref>
                        <span
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                color: '#0879bf',
                            }}
                        >
                            此处
                        </span>
                    </Link>
                    登录
                </p>
                <SignupComponent />
            </div>
        </div>
    )
}

export default Signup
