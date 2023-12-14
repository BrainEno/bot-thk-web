import type { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { PopulatedBlog } from '../generated/graphql-request'

type ServerSideTranslations = Awaited<ReturnType<typeof serverSideTranslations>>

export type { ServerSideTranslations }
export interface BlogWithClassName extends PopulatedBlog {
    index: number
    extendClassName: string
}

export interface ICarouselItem {
    src: string
    title: string
    slug: string
    link: string
    width: number
    height: number
}
