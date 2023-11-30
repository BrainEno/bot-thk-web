import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'

import useWindowSize from '../../hooks/useWindowSize'

export interface BannerImgProps {
    imgSrc: string
    alt?: string
    isVisible?: boolean
    inEditor?: boolean
}

const BannerImg = ({
    imgSrc,
    alt,
    isVisible = true,
    inEditor = false,
}: BannerImgProps) => {
    const { windowWidth } = useWindowSize()
    const height = windowWidth! > 900 ? '500px' : '300px'
    const imgHeight = windowWidth! > 900 ? '400px' : '240px'

    return (
        <AnimatePresence>
            {isVisible && windowWidth && (
                <motion.div
                    className="banner-container"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: 1,
                        height: inEditor ? imgHeight : height,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                    exit={{
                        opacity: 0,
                        height: 0,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                    }}
                    style={{
                        height,
                    }}
                >
                    <Image
                        className="banner-img"
                        priority={true}
                        sizes="(max-width: 900px) 305px,
                               350px"
                        fill
                        alt={alt || 'banner'}
                        src={imgSrc}
                        quality={windowWidth! > 900 ? 75 : 45}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default BannerImg
