import React, { useEffect, useState } from 'react'
import { AiOutlineInfoCircle, AiOutlineWarning } from 'react-icons/ai'
import { LiaCheckCircle } from 'react-icons/lia'

type AlertColor = 'error' | 'warn' | 'success' | 'info'

interface AlertProps {
    message: string
    severity?: AlertColor
    timeout?: number
}

export const MyAlert: React.FC<AlertProps> = ({
    message,
    severity,
    timeout,
}) => {
    const [open, setOpen] = useState(true)

    useEffect(() => {
        if (timeout) {
            setTimeout(() => setOpen(false), timeout)
        }
    }, [timeout])

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

export const showAlert = (
    message: string,
    severity?: AlertColor,
    timeout = 1000
) => {
    return (
        <>
            {message && (
                <MyAlert
                    message={message}
                    severity={severity}
                    timeout={timeout}
                />
            )}
        </>
    )
}
