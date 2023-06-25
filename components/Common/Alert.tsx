import React, { useState } from 'react'
import { AiOutlineInfoCircle, AiOutlineWarning } from 'react-icons/ai'
import { LiaCheckCircle } from 'react-icons/lia'

type AlertColor = 'error' | 'warn' | 'success' | 'info'

interface AlertProps {
    message: string
    severity?: AlertColor
}

export const MyAlert: React.FC<AlertProps> = ({ message, severity }) => {
    const [open, setOpen] = useState(true)

    return (
        <>
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className={`alert ${severity ? severity : 'info'}`}
                >
                    {severity === 'warn' ? (
                        <AiOutlineWarning size={18} />
                    ) : severity === 'success' ? (
                        <LiaCheckCircle size={18} />
                    ) : (
                        <AiOutlineInfoCircle
                            size={18}
                            color={severity === 'error' ? '#fff' : '#06111b'}
                        />
                    )}
                    {message}
                </div>
            )}
        </>
    )
}

export const showAlert = (message: string, severity?: AlertColor) => {
    return <>{message && <MyAlert message={message} severity={severity} />}</>
}
