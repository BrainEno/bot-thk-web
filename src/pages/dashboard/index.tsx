'use client'

import dynamic from 'next/dynamic'

import { useAuthStore } from '../../hooks/store/useAuthStore'
import useAuth from '../../hooks/useAuth'

const UserDashboard = dynamic(
    import('../../components/dashboard/UserDashboard'),
    { ssr: false }
)

const UserCenter = () => {
    const user = useAuthStore((state) => state.user)
    const isAuth = useAuth(true)

    return <>{user && isAuth && <UserDashboard user={user} />}</>
}

export default UserCenter
