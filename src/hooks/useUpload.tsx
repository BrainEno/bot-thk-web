import { useEffect, useState } from 'react'

import { getErrorMsg } from '../helpers/getErrorMsg'

export const useUploadImage = (
    defaultImage?: string,
    uploadCallback?: (imageUri: string) => void
) => {
    const [image, setImage] = useState(defaultImage || '')
    const [error, setError] = useState('')

    const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target

        if (!files || !files[0]) return
        const url = process.env.NEXT_PUBLIC_CLOUDINARY_URI!
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME!

        const formData = new FormData()
        formData.append('file', files[0])
        formData.append('upload_preset', preset)
        formData.append('cloud_name', cloudName)

        // console.log(url, preset, cloudName)
        fetch(url, { method: 'POST', body: formData })
            .then((res) => res.json())
            .then((data) => {
                // console.log('data', data)
                const imageUri = data.secure_url

                // console.log(imageUri)
                if (uploadCallback) {
                    uploadCallback(imageUri)
                }

                setImage(imageUri)
                setError('')
            })
            .catch((error) => {
                const errMsg = getErrorMsg(error)
                setError(errMsg)
            })
    }

    useEffect(() => {
        return () => setImage('')
    }, [])

    return { image, setImage, upload, error }
}
