import { useCallback, useEffect, useRef, useState } from 'react'
import React from 'react'
import { FiPause, FiPlay } from 'react-icons/fi'
import { GrNext, GrPrevious } from 'react-icons/gr'
import classNames from 'classnames'

import { ICarouselItem } from '../../types'

import { CarouselItem } from './CarouselItem'

export type SlideDirection = 'to-right' | 'to-left'

const items: ICarouselItem[] = [
    {
        src: '/images/recent-post.jpg',
        title: 'Recent Post',
        link: '/categories/recent-post',
        width: 2048,
        height: 1701,
    },
    {
        src: '/images/featured.png',
        title: 'Featured',
        link: '/categories/featured',
        width: 1920,
        height: 1657,
    },
    {
        src: '/images/trending.png',
        title: 'Trending',
        link: '/categories/trending',
        width: 1920,
        height: 1299,
    },
]

const SWIPE_THRESHOLD = 40

const CarouselComponent = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [animating, setAnimating] = useState(false)
    const touchStartX = useRef<number>(0)
    const touchStartY = useRef<number>(0)
    const [direction, setDirection] = useState<SlideDirection>('to-right')

    const next = useCallback(() => {
        setDirection('to-right')
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
        setActiveIndex(nextIndex)
    }, [activeIndex])

    const previous = useCallback(() => {
        setDirection('to-left')
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
        setActiveIndex(nextIndex)
    }, [activeIndex])

    const goToIndex = (newIndex: number) => {
        setActiveIndex(newIndex)
    }

    const cycleInterval = useRef<null | NodeJS.Timer>(null)

    const clear = useCallback(() => {
        if (cycleInterval.current) {
            clearInterval(cycleInterval.current)
        }
    }, [])

    const set = useCallback(() => {
        clear()

        cycleInterval.current = setInterval(() => {
            next()
        }, 4000)
    }, [clear, next])

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = e.changedTouches[0].screenX
        touchStartY.current = e.changedTouches[0].screenY
    }

    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        const currentX = e.changedTouches[0].screenX
        const currentY = e.changedTouches[0].screenY
        const diffX = Math.abs(touchStartX.current - currentX)
        const diffY = Math.abs(touchStartY.current - currentY)

        if (diffX < diffY) {
            return
        }

        if (diffX < SWIPE_THRESHOLD) {
            return
        }

        if (currentX < touchStartX.current) {
            next()
        } else {
            previous()
        }
    }

    const hoverStart = () => {
        clear()
    }

    const hoverEnd = () => {
        set()
    }

    useEffect(() => {
        animating && set()
        return () => {
            clear()
        }
    }, [activeIndex, animating, set, clear])

    return (
        <div
            className="carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseEnter={hoverStart}
            onMouseLeave={hoverEnd}
        >
            <div className="carousel-wrapper">
                <GrPrevious
                    className="carousel-icon previous"
                    onClick={previous}
                    size={100}
                />
                <CarouselItem
                    item={items[activeIndex]}
                    next={next}
                    previous={previous}
                    direction={direction}
                />
                <GrNext
                    className="carousel-icon next"
                    onClick={next}
                    size={100}
                />
                <ol className="indiactors-container">
                    {items.map((item, index) => (
                        <li
                            className={classNames('carousel-indicator', {
                                active: activeIndex === index,
                            })}
                            key={item.title}
                            onClick={(e) => {
                                e.preventDefault()
                                goToIndex(index)
                            }}
                        ></li>
                    ))}
                </ol>
            </div>
            <>
                {animating ? (
                    <FiPause
                        title="停止轮播"
                        className="animating-btn"
                        onClick={() => setAnimating(false)}
                    />
                ) : (
                    <FiPlay
                        title="开始轮播"
                        className="animating-btn"
                        onClick={() => setAnimating(true)}
                    />
                )}
            </>
        </div>
    )
}

export default CarouselComponent
