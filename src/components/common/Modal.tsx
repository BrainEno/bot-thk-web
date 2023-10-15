// import './Modal.module.scss'

import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MdClose } from 'react-icons/md'

interface ModalProps {
    children: ReactNode
    onClose: () => void
    title: string
    // eslint-disable-next-line react/require-default-props
    closeOnClickOutside?: boolean
    className?: string
}

function PortalImpl({
    onClose,
    children,
    title,
    closeOnClickOutside,
    className = 'Modal__modal',
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (modalRef.current) {
            modalRef.current.focus()
        }
    }, [])

    useEffect(() => {
        let modalOverlayElement: HTMLElement | null = null
        const handler = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        const clickOutsideHandler = (event: MouseEvent) => {
            const { target } = event
            if (
                modalRef.current !== null &&
                !modalRef.current.contains(target as Node) &&
                closeOnClickOutside
            ) {
                onClose()
            }
        }

        if (modalRef.current !== null) {
            modalOverlayElement = modalRef.current?.parentElement
            if (modalOverlayElement !== null) {
                modalOverlayElement?.addEventListener(
                    'click',
                    clickOutsideHandler
                )
            }
        }

        window.addEventListener('keydown', handler)

        return () => {
            window.removeEventListener('keydown', handler)
            if (modalOverlayElement !== null) {
                modalOverlayElement?.removeEventListener(
                    'click',
                    clickOutsideHandler
                )
            }
        }
    }, [closeOnClickOutside, onClose])

    return (
        <div className="Modal__overlay" role="dialog">
            <div className={className} tabIndex={-1} ref={modalRef}>
                <h2 className="Modal__title">{title}</h2>
                <button
                    className="Modal__closeButton"
                    aria-label="关闭弹窗"
                    type="button"
                    onClick={onClose}
                >
                    <MdClose />
                </button>
                <div className="Modal__content">{children}</div>
            </div>
        </div>
    )
}

const Modal = ({
    onClose,
    children,
    title,
    className = 'Modal__modal',
    closeOnClickOutside = false,
}: ModalProps): JSX.Element => {
    return createPortal(
        <PortalImpl
            onClose={onClose}
            title={title}
            className={className}
            closeOnClickOutside={closeOnClickOutside}
        >
            {children}
        </PortalImpl>,
        document.body
    )
}

export default Modal
