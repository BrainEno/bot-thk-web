import { PopulatedBlog } from '../generated/graphql-request'

export interface BlogWithClassName extends PopulatedBlog {
    index: number
    extendClassName: string
}

export interface ICarouselItem {
    src: string
    title: string
    link: string
    width: number
    height: number
}
