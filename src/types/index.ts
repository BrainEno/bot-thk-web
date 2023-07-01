export interface IBlog {
    _id: string
    title: string
    slug: string
    body: string
    description: string
    mtitle: string
    imageUri?: string
    image?: string
    author: IUser
    tags: ITag[]
    categories: ICategory[]
    createdAt: string
    updatedAt: string
    __v: number
}

export interface BlogWithClassName extends IBlog {
    index: number
    extendClassName: string
}

export interface IUser {
    username: string
    name?: string
    password: string
    email: string
    profile?: string
    role: number
    photo?: string
    about: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface ICategory {
    _id: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface ITag {
    _id: string
    name: string
    slug: string
    createdAt: string
    updatedAt: string
    __v: number
}

export interface ICarouselItem {
    src: string
    title: string
    link: string
    width: number
    height: number
}
