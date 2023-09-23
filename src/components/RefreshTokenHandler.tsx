import { useEffect } from 'react'
import { useSession } from 'next-auth/react'

const RefreshTokenHandler = ({
    setInterval,
}: {
    setInterval: (timeRemainimg: number) => void
}) => {
    const { data: session } = useSession()

    useEffect(() => {
        if (session) {
            const timeRemaining = Math.round(
                (session.expires_at - 30 * 1000 - Date.now()) / 1000
            )
            console.log(
                `session exp is ${session.expires_at} session expires ${session.expires},${timeRemaining}ms remain to get called`
            )
            setInterval(timeRemaining > 0 ? timeRemaining : 0)
        }
    }, [session, setInterval])

    return null
}

export default RefreshTokenHandler
