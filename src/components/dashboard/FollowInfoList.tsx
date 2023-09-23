import {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'
import { BsFillChatLeftDotsFill } from 'react-icons/bs'
import { IoMdArrowBack } from 'react-icons/io'
import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

import { GetFollowInfoQuery } from '../../generated/graphql-request'
import { useFollowMutation } from '../../hooks/mutation/useFollowMutation'
import { useUnFollowMutation } from '../../hooks/mutation/useUnFollowMutation'
import useHover from '../../hooks/useHover'
import { useStartConversation } from '../../hooks/useStartConversation'
import { showAlert } from '../common/Alert'
import Modal from '../common/Modal'

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

export const DEFAULT_AVATAR = process.env.NEXT_PUBLIC_DEFULT_AVATAR as string

export const FollowInfo = ({
    user,
    followed,
    setShowModal,
    setToUnFollow,
}: FollowInfoProps) => {
    const unFollowBtn = useRef<HTMLButtonElement>(null!)
    const unFollowHovered = useHover(unFollowBtn)

    const followMutation = useFollowMutation()

    const follow = (name: string) => {
        followMutation.mutate({ followName: name })
    }

    const handleUnFollowClick = (name: string) => {
        setShowModal(true)
        setToUnFollow(name)
    }

    const { createConversation, error } = useStartConversation()

    return (
        <div className="followInfo">
            {error && showAlert(error, 'error')}
            <div className="followInfo-left">
                <Link href={`/profile/${user.username}`}>
                    <Image
                        src={user.photo || DEFAULT_AVATAR}
                        alt="Avatar"
                        width={42}
                        height={42}
                        className="followInfo-avatar"
                    />
                </Link>
                <div className="followInfo-profile">
                    <div className='followInfo-headline'>
                        <Link
                            href={`/profile/${user.username}`}
                            className="followInfo-name"
                        >
                            {user.name}
                        </Link>
                        <button
                            className="chat-btn"
                            onClick={() => createConversation(user._id)}
                        >
                            <BsFillChatLeftDotsFill color="#444" />
                        </button>
                    </div>
                    <span className="followInfo-about">
                        {user.about && user.about}
                    </span>
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
    const [showModal, setShowModal] = useState(false)
    const [toUnFollow, setToUnFollow] = useState('')
    const confirmUnFollow = useRef(false)

    const unFollowMutation = useUnFollowMutation()

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
