export interface globalThis {
    [key: string]: any
}

export declare interface Window {
    DISQUS: any | undefined
    disqus_shortname: string | undefined
    disqus_identifier: string
    disqus_title: string
    disqus_url: string
}

window.DISQUS = window.DISQUS || {}
