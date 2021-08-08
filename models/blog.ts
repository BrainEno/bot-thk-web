import { Schema, ObjectId, Model, model } from 'mongoose'

interface IBlog {
    title: string
    slug: string
    description: string
    body: object
    mtitle: string
    image: string
    categories: ObjectId[]
    tags: ObjectId[]
    author: ObjectId
    actived: boolean
}

const blogSchema = new Schema<IBlog, Model<IBlog>, IBlog>(
    {
        title: {
            type: String,
            trim: true,
            required: true,
            min: 3,
            max: 160,
        },
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        description: {
            type: String,
            max: 100,
        },
        body: {
            type: {},
            required: true,
            min: 50,
            max: 2000000,
        },
        mtitle: {
            type: String,
        },
        image: {
            data: Buffer,
            ContentType: String,
        },
        categories: [
            {
                ref: 'Category',
                required: true,
            },
        ],
        tags: [
            {
                ref: 'Tag',
                required: true,
            },
        ],
        author: {
            ref: 'User',
        },
        actived: {
            default: false,
        },
    },
    { timestamps: true }
)

module.exports = model('BLog', blogSchema)
