import {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

import {
    FollowMutation,
    FollowMutationVariables,
    UnFollowMutation,
    UnFollowMutationVariables,
} from '../../generated/gql/graphql'
import {
    FollowDocument,
    GetFollowInfoQuery,
    UnFollowDocument,
} from '../../generated/graphql-request'
import { fetcher } from '../../graphql/gqlClient'
import useHover from '../../hooks/useHover'
import Modal from '../Common/Modal'

interface FollowInfoProps {
    user: NonNullable<GetFollowInfoQuery['getFollowInfo']>['followers'][0]
    followed: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
    confirmUnFollow: boolean
    setToUnFollow: Dispatch<SetStateAction<string>>
}

interface FollowInfoListProps {
    type: 'FOLLOWER' | 'FOLLOWING' | 'HIDDEN'
    followers: NonNullable<GetFollowInfoQuery['getFollowInfo']>['followers']
    followings: NonNullable<GetFollowInfoQuery['getFollowInfo']>['followings']
    hideFollowInfo: () => void
}

export const DEFAULT_AVATAR =
    'https://res.cloudinary.com/hapmoniym/image/upload/v1608712074/icons/avatar_w5us1g.png'

const FollowInfo = ({
    user,
    followed,
    setShowModal,
    setToUnFollow,
}: FollowInfoProps) => {
    const unFollowBtn = useRef<HTMLButtonElement>(null!)
    const unFollowHovered = useHover(unFollowBtn)
    const queryClient = useQueryClient()
    const followMutation = useMutation<
        FollowMutation,
        Error,
        FollowMutationVariables
    >(
        async ({ followName }) =>
            fetcher<FollowMutation, FollowMutationVariables>(FollowDocument, {
                followName,
            })(),
        {
            onSuccess: (res) => {
                if (res.follow) {
                    queryClient.invalidateQueries(['getFollowInfo'])
                }
            },
        }
    )

    const follow = (name: string) => {
        followMutation.mutate({ followName: name })
    }

    const handleUnFollowClick = (name: string) => {
        setShowModal(true)
        setToUnFollow(name)
    }

    return (
        <div className="followInfo">
            <div className="followInfo-left">
                <Link href={`/profile/${user.username}`}>
                    <Image
                        src={user.photo || DEFAULT_AVATAR}
                        alt="Avatar"
                        width={70}
                        height={70}
                        className="followInfo-avatar"
                    />
                </Link>
                <div className="followInfo-profile">
                    <p className="followInfo-name">{user.name}</p>
                    <p className="followInfo-about">
                        {user.about && user.about}
                    </p>
                </div>
            </div>
            <div className="followInfo-right">
                {followed ? (
                    <button
                        className={classNames('unFollow-btn', {
                            hovered: unFollowHovered,
                        })}
                        ref={unFollowBtn}
                        onClick={() => handleUnFollowClick(user.name)}
                    >
                        {unFollowHovered ? '取消关注' : '已关注'}
                    </button>
                ) : (
                    <button
                        onClick={() => follow(user.name)}
                        className={'follow-btn'}
                    >
                        关注
                    </button>
                )}
            </div>
        </div>
    )
}

const FollowInfoList = ({
    type,
    followers,
    followings,
    hideFollowInfo,
}: FollowInfoListProps) => {
    const queryClient = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [toUnFollow, setToUnFollow] = useState('')
    const confirmUnFollow = useRef(false)

    const unFollowMutation = useMutation<
        UnFollowMutation,
        Error,
        UnFollowMutationVariables
    >(
        async ({ name }) =>
            fetcher<UnFollowMutation, UnFollowMutationVariables>(
                UnFollowDocument,
                {
                    name,
                }
            )(),
        {
            onSuccess: (res) => {
                if (res.unFollow) {
                    queryClient.invalidateQueries(['getFollowInfo'])
                }
            },
        }
    )

    const users = useMemo(() => {
        if (type === 'FOLLOWER') {
            return followers
        } else if (type === 'FOLLOWING') {
            return followings
        } else {
            return []
        }
    }, [followers, followings, type])

    const followed = useCallback(
        (id: string) => {
            return followings.findIndex((f) => f._id === id) !== -1
        },
        [followings]
    )

    const handleConfirm = () => {
        confirmUnFollow.current = true
        unFollowMutation.mutate({ name: toUnFollow })
        setShowModal(false)
    }

    const handleCancel = () => {
        confirmUnFollow.current = false
        setShowModal(false)
    }

    return (
        <div className="dashboard-followInfo">
            {showModal && (
                <Modal
                    onClose={() => setShowModal(false)}
                    title={`取消关注`}
                    closeOnClickOutside
                >
                    <p>确定要取消关注用户 {toUnFollow} 吗？</p>
                    <div className="Modal__footer">
                        <button onClick={handleConfirm}>确定</button>
                        <button onClick={handleCancel}>取消</button>
                    </div>
                </Modal>
            )}
            {users.length && (
                <div className="followInfo-back">
                    <button onClick={hideFollowInfo}>
                        <IoMdArrowBack size={32} />
                        返回
                    </button>
                </div>
            )}
            <div className="followInfo-list">
                {users.length &&
                    users.map((u) => (
                        <FollowInfo
                            followed={followed(u._id)}
                            user={u}
                            key={u._id}
                            setShowModal={setShowModal}
                            confirmUnFollow={confirmUnFollow.current}
                            setToUnFollow={setToUnFollow}
                        />
                    ))}
            </div>
        </div>
    )
}

export default FollowInfoList
