import styled from '@emotion/styled'
import React from 'react'

type LoaderProps = {
    size: number
}

const Loader = styled.div`
    border: ${({ size }: LoaderProps) => size / 2 / 15 + 'px'} solid #f3f3f3;
    border-top: ${({ size }: LoaderProps) => size / 2 / 15 + 'px'} solid #3498db;
    border-radius: 50%;
    width: ${({ size }: LoaderProps) => size + 'px'};
    height: ${({ size }: LoaderProps) => size + 'px'};
    animation: spin 2s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`

const CircleLoader = ({ size }: LoaderProps) => {
    return <Loader size={size}></Loader>
}

export default CircleLoader
