import React from 'react'

const Avatar = ({
    src,
    size,
    radius,
    title = '',
}: {
    src: string
    size: number
    radius?: number
    title?: string
}) => {
    return (
        <div
            title={title}
            style={{
                backgroundImage: src ? `url('${src}') ` : '',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: radius ? `${radius}px` : '50%',
                backgroundSize: 'cover',
                backgroundPositionX: 'center',
                backgroundPositionY: 'center',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer',
            }}
        ></div>
    )
}

export default Avatar
