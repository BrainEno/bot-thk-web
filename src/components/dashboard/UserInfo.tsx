import React, { useMemo, useState } from 'react'
import { FiUsers } from 'react-icons/fi'
import dayjs from 'dayjs'
import Link from 'next/link'

import { CurrentUserQuery } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import useWindowSize from '../../hooks/useWindowSize'
import Avatar from '../Avatar'

interface UserInfoProps {
    user: NonNullable<CurrentUserQuery['currentUser']>
}

const UserInfo = ({ user }: UserInfoProps) => {
    const [name, setName] = useState(user.name)
    const [bio, setBio] = useState(user.about ?? '')
    const [isEditing, setIsEditing] = useState(false)
    const auth = useAuthStore((state) => state.auth)

    const { windowWidth } = useWindowSize()

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
                auth()
                setIsEditing(false)
            } else {
                setIsEditing(false)
            }
        })
    }

    return (
        <div className="userInfo-container">
            <div className="userInfo">
                <div className="avatar-container">
                    <Link href={`/profile/${user.username}`}>
                        <Avatar
                            title="更换头像"
                            size={isDesktop ? 100 : 80}
                            radius={100}
                            src={`${user.photo}`}
                            char={user.name[0].toUpperCase()}
                        />
                    </Link>
                </div>
                {!isEditing && (
                    <>
                        <span className='userInfo-name'>{user.name}</span>
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
                            编辑个人信息
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
                    <div>
                        <span className="userInfo-text white">
                            <FiUsers /> 0 followers · 0 folliowng
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserInfo
