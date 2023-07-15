import Image from 'next/image'
import Link from 'next/link'

const MyIcon = ({ width, height }: { width: number; height: number }) => {
    return (
        <Link href="/">
            <>
                <Image
                    src="/moshIcon.svg"
                    alt="logo"
                    width={width}
                    height={height}
                    quality={75}
                />
            </>
        </Link>
    )
}

export default MyIcon
