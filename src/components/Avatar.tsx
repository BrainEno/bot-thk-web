import React from 'react'

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
    return (
        <div
            title={title}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundImage: src ? `url('${src}') ` : '',
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: radius ? `${radius}px` : '50%',
                backgroundSize: 'cover',
                backgroundPositionX: 'center',
                backgroundPositionY: 'center',
                backgroundRepeat: 'no-repeat',
                cursor: 'pointer',
                color:'#000000',
                fontSize:20,
                fontWeight:800
            }}
        >
            {!src&&char}
        </div>
    )
}

export default Avatar
