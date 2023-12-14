'use client'

import React, {
    memo,
    RefObject,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'
import { FiDownload } from 'react-icons/fi'
import {
    MdIosShare,
    MdOutlineBookmarkAdd,
    MdOutlineBookmarkAdded,
    // MdComment,
} from 'react-icons/md'
import { PiDotsThreeOutlineFill } from 'react-icons/pi'
import { RWebShare } from 'react-web-share'
import { convert } from 'html-to-text'
import { jsPDF } from 'jspdf'
import Image from 'next/image'

import { callAddFont } from '../../../public/noto-sans-sc-ttf/NotoSansSC-Regular-normal'
import { useToggleLikeMutation } from '../../hooks/mutation/useToggleLikeMutation'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useScreenshot } from '../../hooks/useScreenshot'
import useWindowSize from '../../hooks/useWindowSize'
import CircleLoader from '../common/CircleLoader'
import Modal from '../common/Modal'

interface ArticleActionsProps {
    isLiked: boolean
    blogId: string
    blogTitle: string
    blogBody: string
    title: string
    description: string
    pathname: string
    htmlRef: RefObject<HTMLElement>
}

const ArticleActions = ({
    isLiked,
    blogId,
    blogTitle,
    blogBody,
    title,
    description,
    pathname,
    htmlRef,
}: ArticleActionsProps) => {
    const [showMore, setShowMore] = useState(false)
    const toggleLikeMutation = useToggleLikeMutation()
    const toggleLike = useCallback(() => {
        toggleLikeMutation.mutate({ blogId })
    }, [blogId, toggleLikeMutation])

    const [showScreenshot, setShowScreenshot] = useState(false)
    const { windowWidth } = useWindowSize()

    const dropdownRef = useRef<HTMLDivElement | null>(null)

    useClickOutside(dropdownRef, (e) => {
        if (showMore) e.preventDefault()

        setShowMore(false)
    })

    const { image, takeScreenshot, canvasWidth, canvasHeight } = useScreenshot(
        {}
    )

    const imgWidth = useMemo(() => {
        if (windowWidth && windowWidth < 900 && canvasWidth > 0) {
            return canvasWidth / 3.35
        } else {
            return canvasWidth > 2000 && canvasWidth > 0
                ? canvasWidth / 2
                : canvasWidth
        }
    }, [canvasWidth, windowWidth])

    const imgHeight = useMemo(() => {
        if (windowWidth && windowWidth < 900 && canvasWidth > 0) {
            return canvasHeight / 3.35
        } else {
            return canvasWidth > 2000 && canvasWidth > 0
                ? canvasHeight / 2
                : canvasHeight
        }
    }, [canvasWidth, canvasHeight, windowWidth])

    const toggleMore = () => {
        setShowMore(!showMore)
    }

    const saveAsPDF = () => {
        jsPDF.API.events.push(['addFonts', callAddFont])

        const pageWidth = 275
        const lineHeight = 15
        const margin = 10
        const maxLineWidth = pageWidth - margin * 2
        const fontSize = 12
        const ptsPerInch = 30
        const oneLineHeight = (fontSize * lineHeight) / ptsPerInch

        const doc = new jsPDF('p', 'mm', 'a4')
        const text = convert(blogBody, { wordwrap: 130 })

        const textLines = doc
            .setFont('NotoSansSC-Regular')
            .splitTextToSize(text, maxLineWidth)

        console.log('text Lines:', textLines)

        const pageHeight = doc.internal.pageSize.getHeight()
        console.log('pageHeight:', pageHeight)

        let y = 30

        doc.setFontSize(20).text(blogTitle, 105, 15, {
            align: 'center',
            maxWidth: maxLineWidth,
        })

        for (const textLine of textLines) {
            if (y + oneLineHeight + margin > pageHeight) {
                doc.setFontSize(11)
                    .setTextColor(191, 191, 191)
                    .text('版权归作者所有，请勿随意转载', 200, pageHeight - 8, {
                        align: 'right',
                        maxWidth: maxLineWidth,
                    })
                doc.addPage()
                y = 15
            }
            doc.setFontSize(fontSize)
                .setTextColor(0, 0, 0)
                .text(textLine, margin, y, {
                    align: 'justify',
                    maxWidth: maxLineWidth,
                })
            y += oneLineHeight
        }

        doc.setFontSize(11)
            .setTextColor(191, 191, 191)
            .text('版权归作者所有，请勿随意转载', 200, pageHeight - 8, {
                align: 'right',
                maxWidth: maxLineWidth,
            })

        doc.save(`${blogTitle}.pdf`)
    }

    const getScreenshot = () => {
        setShowMore(false)
        takeScreenshot(htmlRef!.current!).then(() => {
            setShowScreenshot(true)
        })
    }

    return (
        <div className="article-actions">
            <div className="article-actions-left">
                {/* <button>
                    <MdComment size={22} />
                </button> */}
            </div>
            <div className="article-actions-right">
                <button onClick={toggleLike}>
                    {!isLiked ? (
                        <MdOutlineBookmarkAdd size={24} />
                    ) : (
                        <MdOutlineBookmarkAdded color="#1876d2" size={24} />
                    )}
                </button>
                <RWebShare
                    data={{
                        text: `分享文章 ${description}`,
                        url: pathname,
                        title: title,
                    }}
                    onClick={() => console.log('shared successfully!')}
                >
                    <button>
                        <MdIosShare size={22} />
                    </button>
                </RWebShare>
                <button onClick={toggleMore}>
                    <PiDotsThreeOutlineFill size={18} />
                </button>
                {showMore && (
                    <div
                        className="more-dropdown"
                        data-html2canvas-ignore="true"
                        ref={dropdownRef}
                    >
                        <div className="dropdown-item" onClick={getScreenshot}>
                            文章截图
                        </div>
                        <div className="dropdown-item" onClick={saveAsPDF}>
                            下载PDF
                        </div>
                    </div>
                )}

                {showScreenshot && (
                    <Modal
                        title="文章截图"
                        onClose={() => setShowScreenshot(false)}
                        closeOnClickOutside
                        className="screenshot-modal"
                    >
                        {image ? (
                            <div className="screenshot-wrapper">
                                <Image
                                    width={imgWidth}
                                    height={imgHeight}
                                    objectFit="contain"
                                    src={image}
                                    alt="screenshot"
                                    crossOrigin="anonymous"
                                />
                                <a
                                    href={image}
                                    className="download-screenshot"
                                    download={`${title}-screenshot.png`}
                                >
                                    <FiDownload size={24} />
                                </a>
                            </div>
                        ) : (
                            <CircleLoader size={30} />
                        )}
                    </Modal>
                )}
            </div>
        </div>
    )
}

export default memo(ArticleActions)
