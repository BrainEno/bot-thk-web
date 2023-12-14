import { Fragment, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

import useWindowSize from '../../hooks/useWindowSize'

const LanguageSwitcher = () => {
    const { i18n } = useTranslation()
    const { language: currentLanguage } = i18n
    const router = useRouter()
    const locales = router.locales ?? [currentLanguage]
    const { windowWidth } = useWindowSize()

    const languageNames = useMemo(() => {
        return new Intl.DisplayNames([currentLanguage], {
            type: 'language',
        })
    }, [currentLanguage])

    const switchToLocale = useCallback(
        (locale: string) => {
            const path = router.asPath

            return router.push(path, path, { locale })
        },
        [router]
    )

    return (
        <div className="lang-switcher">
            {locales.map((locale: string, index: number) => (
                <Fragment key={index}>
                    {index !== 0 && <span>/</span>}
                    <span
                        className={classNames('lang-span', {
                            selected: locale === currentLanguage,
                        })}
                        onClick={() => switchToLocale(locale)}
                    >
                        {windowWidth && windowWidth > 900
                            ? languageNames
                                  .of(locale!)
                                  ?.slice(0, 2)
                                  .toUpperCase()
                            : locale}
                    </span>
                </Fragment>
            ))}
        </div>
    )
}

export default LanguageSwitcher
