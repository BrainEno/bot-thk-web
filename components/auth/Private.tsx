import { ReactChild, useEffect } from 'react'
import { useRouter } from 'next/router'

import { isAuth } from '../../actions/auth'

const Private = ({ children }: { children: ReactChild }) => {
    const router = useRouter()
    useEffect(() => {
        if (!isAuth()) {
            router.push('/signin')
        }
    }, [router])
    return <>{children}</>
}

export default Private
