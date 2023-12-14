'use client'

import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { useAuthStore } from '../../hooks/store/useAuthStore'
import useAuth from '../../hooks/useAuth'
import { ServerSideTranslations } from '../../types'

const UserDashboard = dynamic(
    import('../../components/dashboard/UserDashboard').then(
        (mod) => mod.default
    ),
    { ssr: false }
)

const UserCenter = () => {
    const user = useAuthStore((state) => state.user)
    const isAuth = useAuth(true)

    return <>{user && isAuth && <UserDashboard user={user} />}</>
}

export default UserCenter

export const getServerSideProps: GetServerSideProps<
    ServerSideTranslations
> = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? 'en', [
                'common',
                'dashboard',
            ])),
        },
    }
}
