import { useRef } from 'react'
import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

import useHover from '../../hooks/useHover'

interface MenuItemProps {
    title: string
    href: string
    renderIcon?: (color: string) => React.ReactNode
}

const breakpoints: Record<string, number> = {
    sm: 900,
    xl: 1200,
}

const mq = Object.keys(breakpoints)
    .map((key) => [key, breakpoints[key]])
    .reduce((prev, [key, breakpoints]) => {
        prev[key] = `@media (max-width: ${breakpoints}px)`
        return prev
    }, {} as Record<string, string>)

const hoveredStyle = `inset -10px -10px 25px #3B4451, inset 10px 10px 25px #000000`
const normalStyle = `-10px -10px 25px #3B4451, 10px 10px 25px rgba(0, 0, 0, 0.3)`

const dynamicStyles = ({ hovered }: { hovered: boolean }) => css`
    box-shadow: ${hovered ? hoveredStyle : normalStyle};
    color: ${hovered ? '#25cede' : '#eee'};
`

const Li = styled.li`
    z-index: 20;
    cursor: pointer;
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    list-style: none;
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 60px;
    background: #2c2f33;
    border-radius: 25px;
    ${dynamicStyles};
    transition: box-shadow 0.2s ease-in-out;

    span {
        margin-left: 6px;
        margin-right: 6px;
        cursor: pointer;
        letter-spacing: 3px;
        &:hover {
            color: #25cede;
        }
    }

    ${mq.sm} {
        width: 50px;
        height: 30px;
        background: linear-gradient(
            191.11deg,
            rgba(8, 4, 0, 0.9) -308.15%,
            rgba(242, 109, 12, 0) 31.34%
        );
        box-shadow: -4px -2px 10px rgba(53, 54, 54, 0.09),
            4px 2px 10px rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        margin: 10px 12px;
        padding: 2px 6px;

        a {
            justify-content: center;
            align-items: center;
            width: 50px;
            border-radius: 12px;
        }

        & .span-text {
            display: none;
        }
    }
`

const MenuItem: React.FC<MenuItemProps> = ({ title, href, renderIcon }) => {
    const liRef = useRef<HTMLLIElement>(null)
    const hovered = useHover(liRef)

    const color = hovered ? '#25cede' : '#eee'
    return (
        <Li hovered={hovered} as="li" ref={liRef}>
            <Link href={href} passHref>
                {renderIcon && renderIcon(color)}
            </Link>
            <Link href={href} passHref style={{ color }}>
                <span className="span-text">{title}</span>
            </Link>
        </Li>
    )
}

export default MenuItem
