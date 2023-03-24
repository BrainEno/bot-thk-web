import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'

import { ICarouselItem } from '../../types'

import { SlideDirection } from './Carousel'

interface ICarouselItemProps {
    item: ICarouselItem
    direction: SlideDirection
    next: () => void
    previous: () => void
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
}

export const CarouselItem: React.FC<ICarouselItemProps> = ({
    item,
    direction,
    previous,
    next,
}) => {
    const [titleShow, setTitleShow] = useState(false)

    const onLoaded = () => {
        setTitleShow(true)
    }
    const variants = useMemo(() => {
        const toRight = direction === 'to-right'
        return {
            enter: () => ({
                x: toRight ? 300 : -300,
                opacity: 0,
            }),
            center: {
                // zIndex: 1,
                x: 0,
                opacity: 1,
            },
            exit: () => ({
                // zIndex: 0,
                x: toRight ? -300 : 300,
                opacity: 0,
            }),
        }
    }, [direction])
    return (
        <AnimatePresence initial={false} custom={direction}>
            <div className="carousel-item">
                <Link href={item.link} passHref>
                    {titleShow && (
                        <div className="carousel-title">
                            <h1>{item.title}</h1>
                            <h1>{item.title}</h1>
                        </div>
                    )}
                </Link>
                <div className="slider-img-wrapper">
                    <motion.img
                        key={item.title}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: 'spring', stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 },
                        }}
                        src={item.src}
                        loading="eager"
                        onLoad={onLoaded}
                        alt="category slider image"
                        className="slider-img"
                        sizes="100vw"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x)

                            if (swipe < -swipeConfidenceThreshold) {
                                next()
                            } else if (swipe > swipeConfidenceThreshold) {
                                previous()
                            }
                        }}
                    />
                </div>
            </div>
        </AnimatePresence>
    )
}
