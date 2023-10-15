import React from 'react'

interface SkeletonLoaderProps {
    count: number
    height: number
    width: number
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    count,
    height,
    width,
}) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <div
                    className="conversation-skeleton"
                    key={i}
                    style={{
                        height,
                        width,
                        borderRadius: 4,
                    }}
                />
            ))}
        </>
    )
}
export default SkeletonLoader
