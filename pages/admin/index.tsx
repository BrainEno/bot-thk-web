import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import UserDashboard from '../../components/profile/UserDashboard'
import { useAuthStore } from '../../hooks/store/useAuthStore'

const AdminIndex = () => {
      const { user } = useAuthStore()
    const router = useRouter()
    useEffect(() => {
        if (!user) {
            router.push('/signin')
        } else if (user.role != '1') {
            router.push('/')
        }
    }, [router, user])
    return (
        <>
            <UserDashboard user={user} />
        </>
    )
}

export default AdminIndex
