export interface globalThis {
    [key: string]: any
}

export declare module '*.ttf'

export declare interface Window {
    DISQUS: any | undefined
    disqus_shortname: string | undefined
    disqus_identifier: string
    disqus_title: string
    disqus_url: string
    gtag: any
}

window.DISQUS = window.DISQUS || {}
