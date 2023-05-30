import React, { useState } from 'react'

type AlertColor = 'error' | 'warn' | 'success'

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
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        zIndex: 100,
                        transform: 'translateX(-50%) translateY(-50%)',
                    }}
                    className={severity ? severity : 'success'}
                >
                    {message}
                </div>
            )}
        </>
    )
}

export const showAlert = (message: string, severity?: AlertColor) => {
    return <>{message && <MyAlert message={message} severity={severity} />}</>
}
