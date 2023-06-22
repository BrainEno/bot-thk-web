import Image from 'next/image'

import useWindowSize from '../hooks/useWindowSize'

const BannerImg = ({ imgSrc, alt }: { imgSrc: string; alt?: string }) => {
    const { windowWidth } = useWindowSize()

    return (
        <div
            className="banner-container"
            style={{
                height: windowWidth! > 900 ? '500px' : '300px',
            }}
        >
            {windowWidth && (
                <Image
                    className="banner-img"
                    priority={true}
                    src={imgSrc}
                    sizes="(max-width: 900px) 305px,
                               350px"
                    fill
                    alt={alt || 'banner'}
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                    }}
                    quality={windowWidth! > 900 ? 75 : 45}
                />
            )}
        </div>
    )
}

export default BannerImg
