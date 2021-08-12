import Image from 'next/image'
import Link from 'next/link'

interface IMyBrand {
    width: number
    height: number
    fontSize?: string
    cursor?: string
}

const MyBrand: React.FC<IMyBrand> = ({
    width,
    height,
    fontSize,
    cursor = 'default',
}) => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Link href="/" passHref>
            <span
                style={{
                    fontSize: fontSize ?? '28px',
                    fontWeight: 700,
                    fontFamily: '-apple-system',
                    marginRight: '10px',
                    cursor: 'default',
                }}
            >
                BOT THK
            </span>
        </Link>
        <div style={{ cursor }}>
            <Image
                src="/moshIcon.svg"
                alt="logo"
                quality={60}
                width={width}
                height={height}
            />
        </div>
    </div>
)

export default MyBrand
