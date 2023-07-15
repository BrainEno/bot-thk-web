import Image from 'next/image'

interface BrandProps {
    width: number
    height: number
    fontSize?: string
    cursor?: string
}

const MyBrand: React.FC<BrandProps> = ({
    width,
    height,
    fontSize,
    cursor = 'default',
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
                marginRight: '10px',
                cursor: 'default',
            }}
        >
            BOT THK
        </span>
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
