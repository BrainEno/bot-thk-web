import React from 'react'
import styled from '@emotion/styled'

interface SwitchProps {
    isOn: boolean
    handleToggle: () => void
    colorOne: string
    colorTwo: string
}

const SwitchCheckbox = styled.input`
    height: 0;
    width: 0;
    visibility: hidden;

    &:checked + .switch-label .switch-button {
        left: calc(100% + 2px);
        transform: translateX(-100%);
    }
`

const SwitchLabel = styled.label`
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    width: 40px;
    height: 20px;
    background: grey;
    border-radius: 40px;
    position: relative;
    transition: background-color 0.2s;

    & .switch-button {
        content: '';
        position: absolute;
        top: -1px;
        left: -1px;
        width: 22px;
        height: 22px;
        border-radius: 22px;
        transition: 0.2s;
        background: #fff;
        box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
    }

    &:active .switch-button {
        width: 50px;
    }
`

export const Switch = ({
    isOn,
    handleToggle,
    colorOne,
    colorTwo,
}: SwitchProps) => {
    return (
        <>
            <SwitchCheckbox
                type="checkbox"
                checked={isOn}
                onChange={handleToggle}
                className="switch-checkbox"
                id="switch"
            />
            <SwitchLabel
                style={{ background: isOn ? colorOne : colorTwo }}
                className="switch-label"
                htmlFor="switch"
            >
                <span className="switch-button" />
            </SwitchLabel>
        </>
    )
}
