import { Dispatch, SetStateAction } from 'react'
import { BsFillChatLeftDotsFill } from 'react-icons/bs'
import Image from 'next/image'
import Link from 'next/link'

import { CurrentUserQuery } from '../../generated/graphql-request'
import { useFollowMutation } from '../../hooks/mutation/useFollowMutation'
import { useUnFollowMutation } from '../../hooks/mutation/useUnFollowMutation'
import { useFollowInfo } from '../../hooks/query/useFollowInfo'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useStartConversation } from '../../hooks/useStartConversation'
import { showAlert } from '../common/Alert'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'

export interface UserCardProps {
    searchedUserId: string
    photo: string
    name: string
    about: string
    username: string
    curUser: CurrentUserQuery['currentUser']
    setWarn: Dispatch<SetStateAction<string>>
}

const UserCard = ({
    searchedUserId,
    photo,
    name,
    about,
    username,
    curUser,
    setWarn,
}: UserCardProps) => {
    const user = useAuthStore((state) => state.user)

    const { followings } = useFollowInfo({
        enabled: !!(user && user.username),
        tag: user!.name,
        username: user!.username,
    })

    const curUserId = curUser?._id

    const followMutation = useFollowMutation()

    const unFollowMutation = useUnFollowMutation()

    const { createConversation, error: createConversationError } =
        useStartConversation()

    const follow = (name: string) => {
        if (curUser) {
            followMutation.mutate({ followName: name })
        } else {
            setWarn('请登录后重试')
        }
    }

    const unFollow = (name: string) => {
        if (user) {
            unFollowMutation.mutate({ name })
        } else {
            setWarn('请登录后重试')
        }
    }

    return (
        <div className="user-card">
            {createConversationError &&
                showAlert(createConversationError, 'error')}
            <div className="user-avatar-wrp">
                <Link href={`/profile/${username}`}>
                    <Image
                        className="user-avatar"
                        src={photo || DEFAULT_AVATAR}
                        alt="avatar"
                        width={48}
                        height={48}
                    />
                </Link>
            </div>
            <div className="user-info">
                <div className="user-name">
                    <span>{name}</span>
                    {curUserId !== searchedUserId && (
                        <button
                            className="chat-btn"
                            onClick={() => createConversation(searchedUserId)}
                        >
                            <BsFillChatLeftDotsFill />
                        </button>
                    )}
                </div>
                <p className="user-about">{about}</p>
            </div>

            <div className="user-follow">
                {!!user &&
                followings.findIndex((f) => f.username == username) !== -1 ? (
                    <button
                        className="unFollow-button"
                        onClick={() => unFollow(name)}
                    >
                        已关注
                    </button>
                ) : (
                    <button
                        className="follow-button"
                        onClick={() => follow(name)}
                    >
                        关注
                    </button>
                )}
            </div>
        </div>
    )
}

export default UserCard
