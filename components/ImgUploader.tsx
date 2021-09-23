import { NextRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const ImgUploader = ({ router }: { router: NextRouter }) => {
    const [message, setMessage] = useState('')
    const onDrop = useCallback(async (acceptedFiles) => {
        const url = process.env.CLOUDINARY_URL!
        const formData = new FormData()
        acceptedFiles.forEach(async (acceptedFile: any) => {
            formData.append('file', acceptedFile)
            formData.append(
                'upload_preset',
                process.env.NEXT_PUBLIC_CLOUDNARY_UPLOAD_PRESET!
            )
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    body: formData,
                })
                const data = await res.json()
                const image_url = data.public_id
                console.log(image_url)
            } catch (error) {
                setMessage('post image fail')
            }
        })
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
    })
    return (
        <div
            {...getRootProps}
            className={`.dropzone ${isDragActive ? 'active' : null}`}
        >
            <input {...getInputProps()} />
            {isDragActive ? <p>正在上传...</p> : <p>上传图片</p>}
        </div>
    )
}

export default ImgUploader
