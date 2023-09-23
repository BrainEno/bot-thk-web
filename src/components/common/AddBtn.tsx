import React from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'

interface AddBtnProps {
    href: string
    size: number
}

const BtnWrp = styled.div`
    width: ${({ size }: { size: number }) => size + 'px'};
    height: ${({ size }: { size: number }) => size + 'px'};
    border-radius: ${({ size }: { size: number }) => size + 'px'};
    box-shadow: -3px -3px 7px #ffffff, 3px 3px 7px rgba(136, 165, 191, 0.48);
    position: relative;
    & a {
        font-size: ${({ size }: { size: number }) => size + 'px'};
        position: absolute;
        left: 50%;
        top: 46%;
        transform: translateX(-50%) translateY(-50%);
        line-height: ${({ size }: { size: number }) => size + 'px'};
        transition: all 230ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        &:hover {
            color: #2997ff;
        }
    }

    @media screen and (max-width: 900px) {
        width: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
        height: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
        border-radius: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
        margin-bottom: 20px;
        margin-right: 20px;
        position: fixed;
        bottom: 280px;
        right: -2px;
        background-color: #f0f4f9;
        border: 2px solid rgba(136, 165, 191, 0.48);
        box-shadow: -1px -1px 2px #ffffff,
            2px 2px 25px rgba(136, 165, 191, 0.48);

        & a {
            font-size: ${({ size }: { size: number }) => (size * 3) / 4 + 'px'};
            line-height: ${({ size }: { size: number }) =>
                (size * 3) / 4 + 'px'};
        }
    }
`

const AddBtn: React.FC<AddBtnProps> = ({ href, size }) => {
    return (
        <BtnWrp className="add-btn" size={size} title="新建">
            <Link href={href}>+</Link>
        </BtnWrp>
    )
}

export default AddBtn
