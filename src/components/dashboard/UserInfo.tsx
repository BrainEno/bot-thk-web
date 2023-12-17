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
import classNames from 'classnames'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

import { CurrentUserQuery } from '../../generated/graphql-request'
import { sdk } from '../../generated/sdk'
import { getLocaleFromNow } from '../../helpers/date'
import { getErrorMsg } from '../../helpers/getErrorMsg'
import { useFollowInfo } from '../../hooks/query/useFollowInfo'
import { useAuthStore } from '../../hooks/store/useAuthStore'
import { useUploadImage } from '../../hooks/useUpload'
import useWindowSize from '../../hooks/useWindowSize'
import { showAlert } from '../common/Alert'

import { RightSideStatus } from './UserDashboard'

const Avatar = dynamic(() => import('../common/Avatar'), { ssr: false })

interface UserInfoProps {
    user: NonNullable<CurrentUserQuery['currentUser']>
    status: RightSideStatus
    setStatus: Dispatch<SetStateAction<RightSideStatus>>
}

const UserInfo = ({ user, status, setStatus }: UserInfoProps) => {
    const { t, i18n } = useTranslation('dashboard')
    const isZh = i18n.language === 'zh'
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
                        title={t('change-avatar')}
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
                            title={t('change-avatar')}
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
                                    {!isZh
                                        ? `Joined BOT THK ${getLocaleFromNow(
                                              user.createdAt,
                                              'en'
                                          )}`
                                        : `${getLocaleFromNow(
                                              user.createdAt,
                                              'zh'
                                          )} 加入 BOT THK`}
                                </span>
                            )}
                        </div>

                        <button
                            className="userInfo-btn"
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {t('edit-info')}
                        </button>
                    </>
                )}
                {isEditing ? (
                    <form className="userInfo-form" onSubmit={handleSave}>
                        <div className="userInfo-form-group">
                            <label className="userInfo-label" htmlFor="Name">
                                {t('name')}
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
                                {t('bio')}
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
                                {t('save')}
                            </button>
                            <button
                                className="userInfo-btn sm"
                                onClick={() => setIsEditing(false)}
                            >
                                {t('cancel')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="userInfo-text white">
                        {user.about ?? (isZh ? '什么也没说' : 'Nothing here')}
                    </div>
                )}

                {!isEditing && (
                    <div className="userInfo-follow">
                        <span className="userInfo-text white">
                            <FiUsers style={{ marginRight: 3 }} />
                            <span
                                className="userInfo-link"
                                onClick={() => setStatus('FOLLOWING')}
                            >
                                {isZh
                                    ? ` ${t('followings')} ${
                                          followings.length
                                      } `
                                    : ` ${followings.length} ${t(
                                          'followings'
                                      )} `}
                            </span>{' '}
                            ·
                            <span
                                className="userInfo-link"
                                onClick={() => setStatus('FOLLOWER')}
                            >
                                {isZh
                                    ? ` ${t('followers')} ${followers.length}`
                                    : ` ${followers.length} ${t('followers')} `}
                            </span>
                        </span>
                    </div>
                )}
            </div>
            <div className={'userInfo-nav'}>
                <button
                    className={classNames('userInfo-nav-btn', {
                        selected: status === 'SELF',
                    })}
                    onClick={() => setStatus('SELF')}
                >
                    <FiList />
                    {isDesktop && <span>{t('my-blogs')}</span>}
                </button>
                <button
                    className={classNames('userInfo-nav-btn', {
                        selected: status === 'FOLLOWING',
                    })}
                    onClick={() => setStatus('FOLLOWING')}
                >
                    <FiUserCheck />
                    {isDesktop && <span>{t('my-followings')}</span>}
                </button>
                <button
                    className={classNames('userInfo-nav-btn', {
                        selected: status === 'LIKED',
                    })}
                    onClick={() => setStatus('LIKED')}
                >
                    <FiBookmark />
                    {isDesktop && <span>{t('saved')}</span>}
                </button>
                <Link className="userInfo-nav-btn" href="/">
                    <FiHome />
                    {isDesktop && <span>{t('home-page')}</span>}
                </Link>
            </div>
        </div>
    )
}

export default UserInfo
