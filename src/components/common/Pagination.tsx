import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

interface PaginationProps {
    total: number
    pageSize: number
    defaultCurrent?: number
    onChange: (page: number) => void
}

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    box-shadow: -3px -3px 7px #ffffff, 3px 3px 7px rgba(136, 165, 191, 0.48);
    border-radius: 50px;
    margin: 30px auto;
    font-size: 14px;

    & input {
        width: 8ch;
        display: inline-block;
        text-align: center;
        border: 0.5px solid #ccc;
        margin: 0 10px;
        padding: 1.67px 0;
        outline: none;
        &:hover {
            border-color: #1890ff;
        }
        &::-webkit-input-placeholder {
            font-size: 14px;
        }
    }
    & span {
        display: flex;
        align-items: center;
    }

    & button:first-of-type,
    button:last-of-type {
        border: none;
        background: none;
        cursor: pointer;

        display: inline-flex;
        color: #ccc;
        align-items: center;
        color: #000000;

        &:hover {
            color: #1890ff;
        }
    }
`

export const Pagination: React.FC<PaginationProps> = ({
    total,
    pageSize,
    defaultCurrent,
    onChange,
}) => {
    const [activedIndex, setActivedIndex] = useState(defaultCurrent || 1)
    const lastPage = Math.ceil(total / pageSize)

    const prevPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (activedIndex > 1) {
            setActivedIndex(activedIndex - 1)
        } else {
            setActivedIndex(1)
        }
    }

    const nextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (activedIndex < lastPage) {
            setActivedIndex(activedIndex + 1)
        } else {
            setActivedIndex(lastPage)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setActivedIndex(Number(e.target.value))
    }

    useEffect(() => {
        if (activedIndex !== defaultCurrent) {
            onChange(activedIndex)
        }
    }, [activedIndex, onChange, defaultCurrent])

    return (
        <Container>
            <button
                onClick={prevPage}
                style={{
                    cursor: activedIndex === 1 ? 'not-allowed' : 'pointer',
                }}
            >
                <span role="img" aria-label="left">
                    <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="left"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
                    </svg>
                </span>
            </button>
            <input value={activedIndex} type="text" onChange={handleChange} />
            <span
                style={{
                    letterSpacing: 4,
                    color: '#000000d9',
                    paddingBottom: '1px',
                }}
            >
                / {lastPage}
            </span>
            <button
                style={{
                    marginLeft: '10px',
                    cursor:
                        activedIndex === lastPage ? 'not-allowed' : 'pointer',
                }}
                onClick={nextPage}
            >
                <span role="img" aria-label="right">
                    <svg
                        viewBox="64 64 896 896"
                        focusable="false"
                        data-icon="right"
                        width="1em"
                        height="1em"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                    </svg>
                </span>
            </button>
        </Container>
    )
}
