'use client'

import React from 'react'

import useIsValidSrc from '../../hooks/useIsValiadSrc'
import { DEFAULT_AVATAR } from '../dashboard/FollowInfoList'

const Avatar = ({
    src,
    size,
    radius,
    title = '',
    char,
}: {
    src: string
    size: number
    radius?: number
    title?: string
    char?: string
}) => {
    const isValiadSrc = useIsValidSrc({ source: src })

    return (
        <div
            title={title}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: isValiadSrc
                    ? `url('${src}')`
                    : `url('${DEFAULT_AVATAR}')`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: radius ? `${radius}px` : '50%',
                backgroundSize: 'cover',
                backgroundPositionX: 'center',
                backgroundPositionY: 'center',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer',
                color: '#000000',
                fontSize: 20,
                fontWeight: 800,
            }}
        >
            {!isValiadSrc && char}
        </div>
    )
}

export default Avatar
