import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from './src/i18n/settings'

acceptLanguage.languages(languages)

const PUBLIC_FILE = /\.(.*)$/

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/public|_next/image|assets|favicon.ico|sw.js).*)',
    ],
}

const cookieName = 'NEXT_LOCALE'

export async function middleware(req: NextRequest) {
    let lng: string | null = null
    if (req.cookies.has(cookieName)) {
        lng = acceptLanguage.get(req.cookies.get(cookieName)!.value)
    }
    if (!lng) {
        lng = acceptLanguage.get(req.headers.get('Accept-Language'))
    }

    if (!lng) {
        lng = fallbackLng
    }

    if (PUBLIC_FILE.test(req.nextUrl.pathname)) {
        return
    }

    if (
        !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
        !req.nextUrl.pathname.startsWith('/_next')
    ) {
        return NextResponse.redirect(
            new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
        )
    }

    if (req.headers.has('referer')) {
        const refererUrl = new URL(req.headers.get('referer')!)
        const lngInReferer = languages.find((l) =>
            refererUrl.pathname.startsWith(`/${l}`)
        )
        const response = NextResponse.next()
        if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
        return response
    }

    return NextResponse.next()
}
