import React, { useContext } from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'

import themes from '../../styles/variables.module.scss'
import { ThemeContext } from '../context/ThemeContext'

interface AddBtnProps {
    href: string
    size: number
}

interface BtnWrpProps {
    size: number
    isDark: boolean
}

const BtnWrp = styled.div`
    width: ${({ size }: BtnWrpProps) => size + 'px'};
    height: ${({ size }: BtnWrpProps) => size + 'px'};
    border-radius: ${({ size }: BtnWrpProps) => size + 'px'};
    box-shadow: ${({ isDark }: BtnWrpProps) =>
        isDark
            ? '3px 3px 7px rgba(0,0,0,0.6),-3px -3px 7px rgba(0,0,0,0.3)'
            : '-3px -3px 7px #ffffff, 3px 3px 7px rgba(136, 165, 191, 0.48)'};
    position: relative;

    & a {
        font-size: ${({ size }: BtnWrpProps) => size + 'px'};
        position: absolute;
        left: 50%;
        top: 46%;
        transform: translateX(-50%) translateY(-50%);
        line-height: ${({ size }: BtnWrpProps) => size + 'px'};
        transition: all 230ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        color: ${({ isDark }: BtnWrpProps) =>
            isDark ? themes.white : themes.black};
        &:hover {
            color: #2997ff;
        }
    }

    @media screen and (max-width: 900px) {
        width: ${({ size }: BtnWrpProps) => (size * 3) / 4 + 'px'};
        height: ${({ size }: BtnWrpProps) => (size * 3) / 4 + 'px'};
        border-radius: ${({ size }: BtnWrpProps) => (size * 3) / 4 + 'px'};
        margin-bottom: 20px;
        margin-right: 20px;
        position: fixed;
        bottom: 280px;
        right: -2px;
        background-color: ${({ isDark }: BtnWrpProps) =>
            isDark ? '#000000' : '#f0f4f0'};
        border: 2px solid rgba(136, 165, 191, 0.48);

        box-shadow: ${({ isDark }: BtnWrpProps) =>
            isDark
                ? '3px 3px 7px rgba(0,0,0,0.6),-3px -3px 7px rgba(0,0,0,0.3)'
                : '-3px -3px 7px #ffffff, 3px 3px 7px rgba(136, 165, 191, 0.48)'};
        & a {
            font-size: ${({ size }: BtnWrpProps) => (size * 3) / 4 + 'px'};
            line-height: ${({ size }: BtnWrpProps) => (size * 3) / 4 + 'px'};
        }
    }
`

const AddBtn: React.FC<AddBtnProps> = ({ href, size }) => {
    const { theme } = useContext(ThemeContext)
    const isDark = theme === 'dark'

    return (
        <BtnWrp className="add-btn" size={size} isDark={isDark} title="新建">
            <Link href={href}>+</Link>
        </BtnWrp>
    )
}

export default AddBtn
