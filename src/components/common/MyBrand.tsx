import Image from 'next/image'
import Link from 'next/link'

interface BrandProps {
    width: number
    height: number
    fontSize?: string
    cursor?: string
    toHome?: boolean
}

const MyBrand: React.FC<BrandProps> = ({
    width,
    height,
    fontSize,
    cursor = 'default',
    toHome = false,
}) => (
    <div
        style={{
            display: 'inline-flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <span
            style={{
                fontSize: fontSize ?? '28px',
                fontWeight: 700,
                fontFamily: '-apple-system',
                cursor: 'default',
                display: 'contents',
            }}
        >
            BOT THK
        </span>
        {toHome ? (
            <Link href="/">
                <div style={{ cursor, marginLeft: 8 }}>
                    <Image
                        src="/moshIcon.svg"
                        alt="logo"
                        quality={60}
                        width={width}
                        height={height}
                        crossOrigin="anonymous"
                    />
                </div>
            </Link>
        ) : (
            <div style={{ cursor }}>
                <Image
                    src="/moshIcon.svg"
                    alt="logo"
                    quality={60}
                    width={width}
                    height={height}
                    crossOrigin="anonymous"
                />
            </div>
        )}
    </div>
)

export default MyBrand
