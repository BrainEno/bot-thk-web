import { CSSProperties } from 'react'

export interface IBlog {
    _id: string
    title: string
    body: string
    author: IUser
    description: string
    tags: ITag[]
    categories: ICategory[]
    createdAt: string
    updatedAt: string
    __v: number
}

export interface IBlogWithStyle extends IBlog {
    style?: CSSProperties
}

export interface IUser {
    username: string
    name?: string
    password: string
    email: string
    profile?: string
    role: number
    photo?: Buffer
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
