import { model, Model, Schema } from 'mongoose'
import crypto from 'crypto'

interface IUser {
    username: string
    name: string
    email: string
    profile: string
    hashed_password: string
    salt: string
    about: string
    role: number
    photo: string
    resetPasswordLink: string
    createdAt: number
    updatedAt: number
    encryptPassword: (password: string) => string
}

const userSchema = new Schema<IUser, Model<IUser>, IUser>(
    {
        username: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            unique: true,
            index: true,
            lowercase: true,
        },
        name: {
            type: String,
            trim: true,
            required: true,
            max: 32,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            max: 32,
            unique: true,
            lowercase: true,
        },
        profile: {
            type: String,
            required: true,
        },
        hashed_password: {
            type: String,
            required: true,
        },
        salt: String,
        about: {
            type: String,
        },
        role: {
            type: Number,
            trim: true,
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
        resetPasswordLink: {
            data: String,
            default: '',
        },
    },
    { timestamps: true }
)

userSchema
    .virtual('password')
    .set(function (password: string) {
        //create a temporarity variable called _password
        this._password = password

        // generate salt
        this.salt = this.makeSalt()

        //encryptPassword
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function () {
        return this._password
    })

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    encryptPassword: function (password) {
        if (!password) return ''
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex')
        } catch (err) {
            return ''
        }
    },

    makeSalt: function () {
        return Math.round(new Date().valueOf() * Math.random()) + ''
    },
}

const User = model('User', userSchema)

export default User
