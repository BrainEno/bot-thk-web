// Import the v2 api and rename it to cloudinary
import { v2 as cloudinary, TransformationOptions } from 'cloudinary'

// Initialize the sdk with cloud_name, api_key and api_secret
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})

const CLOUDINARY_FOLDER_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER_NAME

/**
 * Gets a resource from cloudinary using it's public id
 */
export const handleGetCloudinaryResource = (publicId: string) => {
    return cloudinary.api.resource(publicId, {
        resource_type: 'image',
        type: 'upload',
    })
}

/**
 * Get cloudinary uploads
 * @returns {Promise}
 */
export const handleGetCloudinaryUploads = () => {
    return cloudinary.api.resources({
        type: 'upload',
        prefix: CLOUDINARY_FOLDER_NAME,
        resource_type: 'image',
    })
}

/**
 * Uploads an image to cloudinary and returns the upload result
 */
export const handleCloudinaryUpload = (resource: {
    path: string
    transformation?: TransformationOptions
    publicId?: string
    folder?: boolean
}) => {
    return cloudinary.uploader.upload(resource.path, {
        // Folder to store image in
        folder: resource.folder ? CLOUDINARY_FOLDER_NAME : undefined,
        // Public id of image.
        public_id: resource.publicId,
        // Type of resource
        resource_type: 'auto',
        // Transformation to apply to the video
        transformation: resource.transformation,
    })
}

/**
 * Deletes resources from cloudinary. Takes in an array of public ids
 */
export const handleCloudinaryDelete = (ids: string[]) => {
    return cloudinary.api.delete_resources(ids, {
        resource_type: 'image',
    })
}
