import React, { useState } from 'react';

interface AlertProps {
  message: string;
  severity?: AlertColor;
}

export const MyAlert: React.FC<AlertProps> = ({ message, severity }) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {open && (
        <div
          onClose={() => setOpen(false)}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            zIndex: 100,
            transform: 'translateX(-50%) translateY(-50%)',
          }}
          severity={severity ? severity : 'success'}
        >
          {message}
        </div>
      )}
    </>
  );
};

export const showAlert = (message: string, severity?: AlertColor) => {
  return <>{message && <MyAlert message={message} severity={severity} />}</>;
};

