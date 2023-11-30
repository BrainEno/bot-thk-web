import html2canvas from 'html2canvas'
import { useState } from 'react'
import { getErrorMsg } from '../helpers/getErrorMsg'

export const useScreenshot = ({
    type,
    quality,
}: {
    type?: string
    quality?: any
}) => {
    const [image, setImage] = useState<string | null>(null)
    const [error, setError] = useState<string>('')
    const [canvasWidth, setCanvasWidth] = useState(0)
    const [canvasHeight, setCanvasHeight] = useState(0)

    const takeScreenshot = async (node: HTMLElement) => {
        try {
            if (!node) {
                throw new Error('html node not provided')
            }
            console.log('element node:', node)
            const ele = document.querySelector('.article-container')
            if (!ele) return

            const scale = window.devicePixelRatio
            const cvs = document.createElement('canvas')
            cvs.width = ele.getBoundingClientRect().width * scale
            cvs.height = ele.getBoundingClientRect().height * scale

            const ctx = cvs.getContext('2d')
            if (!ctx) return
            const originalDrawImage = ctx.drawImage

            ctx.drawImage = function (
                image: CanvasImageSource,
                sx: number,
                sy: number,
                sw: number,
                sh: number,
                dx: number,
                dy: number,
                dw: number,
                dh: number
            ) {
                if (image instanceof HTMLImageElement) {
                    if (sw / dw < sh / dh) {
                        const _dh = dh
                        dh = sh * (dw / sw)
                        dy = dy + (_dh - dh) / 2
                    } else {
                        const _dw = dw
                        dw = sw * (dh / sh)
                        dx = dx + (_dw - dw) / 2
                    }
                }

                return originalDrawImage.call(
                    ctx,
                    image,
                    sx,
                    sy,
                    sw,
                    sh,
                    dx,
                    dy,
                    dw,
                    dh
                )
            } as any

            const canvas = await html2canvas(node, { canvas: cvs, scale })
            const croppedCanvas = document.createElement('canvas')
            const context = croppedCanvas.getContext('2d')
            const top = 0
            const left = 0
            const width = canvas.width
            const height = canvas.height

            croppedCanvas.width = width
            croppedCanvas.height = height

            setCanvasWidth(width)
            setCanvasHeight(height)

            if (context) context.drawImage(canvas, left, top)

            const base64Image = croppedCanvas.toDataURL(type, quality)

            setImage(base64Image)
            return base64Image
        } catch (err) {
            setError(getErrorMsg(err))
        }
    }

    return {
        image,
        takeScreenshot,
        canvasWidth,
        canvasHeight,
        error,
    }
}

export const createFileName = (extension = '', ...names: string[]) => {
    if (!extension) {
        return ''
    }

    return `${names.join('')}.${extension}`
}
