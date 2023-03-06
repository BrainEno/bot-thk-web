import React from 'react'
import Image from 'next/image'

interface IPostImgProps {
    src: string
    width: string
    height: string
    radius?: number
    shadow?: boolean
}

const PostImg: React.FC<IPostImgProps> = ({
    src,
    width,
    height,
    radius = 50,
    shadow = true,
}) => {

    return (
        <div
            className="post-image-warper skeleton"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.13)',
                width: `${width}`,
                height: `${height}`,
                borderRadius: `${radius}px`,
                boxShadow: shadow
                    ? `6px 6px 10px rgba(0, 0, 0, 0.6),
                      -6px -6px 26px rgba(255, 255, 255, 0.8)`
                    : 'none',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
            }}
        >
            <Image
                className="post-img"
                src={src}
                layout="fill"
                objectFit="cover"
                alt="post image"
                loading="lazy"
                quality={65}
            />
        </div>
    )
}

export default PostImg
