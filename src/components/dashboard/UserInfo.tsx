import React, {
    Dispatch,
    SetStateAction,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    FiBookmark,
    FiHome,
    FiList,
    FiUserCheck,
    FiUsers,
} from 'react-icons/fi'
import dayjs from 'dayjs'

import { CurrentUserQuery } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import { useFollowInfo } from '../../hooks/query/useFollowInfo'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useUploadImage } from '../../hooks/useUpload'
import useWindowSize from '../../hooks/useWindowSize'
import { showAlert } from '../common/Alert'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { RightSideStatus } from './UserDashboard'

const Avatar = dynamic(() => import('../common/Avatar'), { ssr: false })

interface UserInfoProps {
    user: NonNullable<CurrentUserQuery['currentUser']>
    setStatus: Dispatch<SetStateAction<RightSideStatus>>
}

const UserInfo = ({ user, setStatus }: UserInfoProps) => {
    const [name, setName] = useState(user.name)
    const [bio, setBio] = useState(user.about ?? '')
    const avatarInput = useRef<HTMLInputElement | null>(null)
    const [error, setError] = useState('')

    const [isEditing, setIsEditing] = useState(false)
    const setUser = useAuthStore((state) => state.setUser)

    const { followers, followings } = useFollowInfo({
        enabled: !!(user && user.username),
        tag: user.name,
        username: user.username,
    })

    const { windowWidth } = useWindowSize()

    const uploadImageCallback = (imageUri: string) => {
        sdk.EditProfile({ photo: imageUri })
            .then(async (success) => {
                if (success) {
                    await setUser()
                }
            })
            .then((err) => {
                setError(getErrorMsg(err))
            })
    }
    const { image, upload } = useUploadImage(
        `${user.photo}`,
        uploadImageCallback
    )

    const isDesktop = useMemo(
        () => windowWidth && windowWidth > 900,
        [windowWidth]
    )

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value)
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        sdk.EditProfile({ name, about: bio }).then((success) => {
            if (success) {
                setUser().then(() => {
                    setIsEditing(false)
                })
            } else {
                setIsEditing(false)
            }
        })
    }

    return (
        <div className="userInfo-container">
            {showAlert(error, 'error')}
            <div className="userInfo">
                <div className="avatar-container">
                    <label
                        className="icon-btn"
                        title="更换头像"
                        htmlFor="blog-image"
                    >
                        <input
                            type="file"
                            id="blog-image"
                            accept="image/*"
                            hidden
                            ref={avatarInput}
                            onChange={upload}
                        />
                        <Avatar
                            title="更换头像"
                            size={isDesktop ? 100 : 60}
                            radius={100}
                            src={image}
                            char={user.name[0].toUpperCase()}
                        />
                    </label>
                </div>
                {!isEditing && (
                    <>
                        <span className="userInfo-name">{user.name}</span>
                        <div>
                            <span className="userInfo-text">{user.email}</span>
                            {user && (
                                <span className="userInfo-text">
                                    Joined <b>BOT THK</b>
                                    {' ' +
                                        dayjs(user.createdAt, 'zh').fromNow()}
                                </span>
                            )}
                        </div>

                        <button
                            className="userInfo-btn"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            编辑信息
                        </button>
                    </>
                )}
                {isEditing ? (
                    <form className="userInfo-form" onSubmit={handleSave}>
                        <div className="userInfo-form-group">
                            <label className="userInfo-label" htmlFor="Name">
                                昵称
                            </label>
                            <input
                                className="userInfo-input"
                                type="text"
                                onChange={handleNameChange}
                                value={name}
                            />
                        </div>
                        <div className="userInfo-form-group">
                            <label className="userInfo-label" htmlFor="Bio">
                                简介
                            </label>
                            <textarea
                                className="userInfo-input multiple-line"
                                onChange={handleBioChange}
                                value={bio}
                            />
                        </div>
                        <div className="userInfo-group">
                            <button
                                type="submit"
                                className="userInfo-btn sm submit"
                            >
                                保存
                            </button>
                            <button
                                className="userInfo-btn sm"
                                onClick={() => setIsEditing(false)}
                            >
                                返回
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="userInfo-text white">
                        {user.about ?? 'Nothing here'}
                    </div>
                )}

                {!isEditing && (
                    <div className="userInfo-follow">
                        <span className="userInfo-text white">
                            <FiUsers />
                            <span
                                className="userInfo-link"
                                onClick={() => setStatus('FOLLOWING')}
                            >{` 关注 ${followings.length} `}</span>{' '}
                            ·
                            <span
                                className="userInfo-link"
                                onClick={() => setStatus('FOLLOWER')}
                            >{` 被关注 ${followers.length}`}</span>
                        </span>
                    </div>
                )}
            </div>
            <div className="userInfo-nav">
                <button
                    className="userInfo-nav-btn"
                    onClick={() => setStatus('SELF')}
                >
                    <FiList />
                    {isDesktop && '我的博客'}
                </button>
                <button
                    className="userInfo-nav-btn"
                    onClick={() => setStatus('FOLLOWING')}
                >
                    <FiUserCheck />
                    {isDesktop && '我的关注'}
                </button>
                <button
                    className="userInfo-nav-btn"
                    onClick={() => setStatus('LIKED')}
                >
                    <FiBookmark />
                    {isDesktop && '我的收藏'}
                </button>
                <Link className="userInfo-nav-btn" href="/">
                    <FiHome />
                    {isDesktop && '返回首页'}
                </Link>
            </div>
        </div>
    )
}

export default UserInfo
