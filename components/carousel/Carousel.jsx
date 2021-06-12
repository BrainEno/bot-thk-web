import { useEffect, useState } from 'react'
import { CarouselItem } from './CarouselItem'
import { RightOutlined, LeftOutlined } from '@ant-design/icons'

const items = [
    {
        src: '/images/recent.jpg',
        title: 'Reacent Post',
        description: '',
        link: '/categories/recent-post',
        width: 2048,
        height: 1701,
    },
    {
        src: '/images/featured.png',
        title: 'Featured',
        description: '',
        link: '/categories/featured',
        width: 1920,
        height: 1657,
    },
    {
        src: '/images/trending.png',
        title: 'Trending',
        description: '',
        link: '/categories/trending',
        width: 1920,
        height: 1299,
    },
]

const CarouselComponent = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [animating, setAnimating] = useState(false)

    const next = () => {
        if (animating) return
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1
        setActiveIndex(nextIndex)
    }

    const previous = (e) => {
        e.preventDefault()
        if (animating) return
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
        setActiveIndex(nextIndex)
    }

    const goToIndex = (newIndex) => {
        if (animating) return
        setActiveIndex(newIndex)
    }

    let cycleInterval
    const set = () => {
        clear()

        cycleInterval = setInterval(() => {
            next()
        }, 5000)
    }

    const clear = () => {
        clearInterval(cycleInterval)
    }

    useEffect(() => {
        animating && set()
        return () => {
            clear()
        }
    }, [activeIndex])

    return (
        <div className="carousel">
            <LeftOutlined onClick={previous} size={100} />
            <CarouselItem
                item={items[activeIndex]}
                items={items}
                goToIndex={goToIndex}
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
            />

            <RightOutlined onClick={next} size={100} />
        </div>
    )
}

export default CarouselComponent
