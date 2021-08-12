import SigninComponent from '../components/auth/SigninComponent'
import Link from 'next/link'
import MyBrand from '../components/MyBrand'

const Signin = () => {
    return (
        <div className="sign">
            <div className="sign-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <h2 className="sign-title">登录账号</h2>
                <p>
                    还没有账号？点击
                    <Link href="/signup" passHref>
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
                    注册
                </p>
                <SigninComponent />
            </div>
        </div>
    )
}

export default Signin
