"use client"

import UserDashboard from '../../components/dashboard/UserDashboard'
import { useAuthStore } from '../../hooks/store/useAuthStore'

const UserCenter = () => {
    const user = useAuthStore((state) => state.user)

    return <>{user && <UserDashboard user={user} />}</>
}

export default UserCenter
