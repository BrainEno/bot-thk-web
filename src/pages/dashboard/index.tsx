'use client'

import dynamic from 'next/dynamic'

import { useAuthStore } from '../../hooks/store/useAuthStore'

const UserDashboard = dynamic(
    import('../../components/dashboard/UserDashboard'),
    { ssr: false }
)

const UserCenter = () => {
    const user = useAuthStore((state) => state.user)

    return <>{user && <UserDashboard user={user} />}</>
}

export default UserCenter
