import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import SignupComponent from '../components/auth/SignupComponent'
import MyBrand from '../components/common/MyBrand'
import { ServerSideTranslations } from '../types'

const Signup = () => {
    const { t, i18n } = useTranslation('account')
    const isZh = i18n.language === 'zh'

    return (
        <div className="sign">
            <div className="sign-container">
                <div className="brand-container">
                    <MyBrand width={45} height={45} />
                </div>
                <h2 className="sign-title">
                    {isZh ? '新用户注册' : 'WELCOME !'}
                </h2>
                <p>
                    {isZh
                        ? '已经有账号了？点击'
                        : 'Aready have an account? click '}
                    <Link href="/signin" passHref>
                        <span
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                color: '#0879bf',
                            }}
                        >
                            {t('here')}
                        </span>
                    </Link>
                </p>
                <SignupComponent />
            </div>
        </div>
    )
}

export default Signup

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
