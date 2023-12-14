import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import SigninComponent from '../components/auth/SigninComponent'
import MyBrand from '../components/common/MyBrand'
import { ServerSideTranslations } from '../types'

const Signin = () => {
    const { t, i18n } = useTranslation('account')
    const isZh = i18n.language === 'zh'

    return (
        <div className="sign">
            <div className="sign-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <h2 className="sign-title">{isZh ? '登录账号' : 'LOG IN'}</h2>
                <p>
                    {isZh ? '还没有账号？点击' : 'New user? Click '}
                    <Link href="/signup" passHref>
                        <span
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                color: '#0879bf',
                            }}
                        >
                            {` ${t('here')} `}
                        </span>
                    </Link>
                </p>
                <SigninComponent />
            </div>
        </div>
    )
}

export default Signin

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
