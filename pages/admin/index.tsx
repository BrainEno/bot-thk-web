import Admin from '../../components/auth/Admin'
import React from 'react'
import UserDashboard from '../../components/profile/UserDashboard'

const AdminIndex = () => {
    return (
        <Admin>
            <UserDashboard />
        </Admin>
    )
}

export default AdminIndex
