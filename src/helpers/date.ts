import 'dayjs/locale/zh'
import 'dayjs/locale/en'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export const getLocaleFromNow = (
    date?: string | number | dayjs.Dayjs | Date | null | undefined,
    preset?: string | ILocale | undefined
) => {
    dayjs.locale(preset ?? 'en')
    dayjs.extend(relativeTime)
    return dayjs(date).fromNow()
}

export const getLocaleFormatedTime = (
    date?: string | number | dayjs.Dayjs | Date | null | undefined,
    preset?: string | ILocale | undefined
) => {
    dayjs.locale(preset ?? 'en')
    dayjs.extend(relativeTime)
    return preset === 'zh'
        ? dayjs(date).format('YYYY-MM-DD')
        : dayjs(date).format('MMMM,DD,YYYY')
}
