import { Dispatch, SetStateAction } from 'react'
import Image from 'next/image'

import { CurrentUserQuery } from '../../generated/graphql-request'
import { useFollowMutation } from '../../hooks/mutation/useFollowMutation'
import { useUnFollowMutation } from '../../hooks/mutation/useUnFollowMutation';
import { useFollowInfo } from '../../hooks/query/useFollowInfo'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'


export interface UserCardProps {
    photo: string
    name: string
    about: string
    username: string
    curUser: CurrentUserQuery['currentUser']
    setWarn: Dispatch<SetStateAction<string>>
}

const UserCard = ({
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

    const followMutation = useFollowMutation()

    const unFollowMutation =useUnFollowMutation() 

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
            <div className="user-avatar-wrp">
                <Image
                    className="user-avatar"
                    priority={true}
                    src={photo || DEFAULT_AVATAR}
                    alt="avatar"
                    width={48}
                    height={48}
                />
            </div>
            <div className="user-info">
                <div className="user-name">{name}</div>
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
