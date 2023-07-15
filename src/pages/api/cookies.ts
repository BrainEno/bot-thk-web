import { getCookie } from 'cookies-next'
import { NextApiRequest, NextApiResponse } from 'next'

import { getErrorMsg } from '../../helpers/getErrorMsg'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const currentCookie = getCookie('botthk_refresh', { req, res })
        console.log('currentCookie',currentCookie)
        res.setHeader(
            'set-cookie',
            `botthk-refresh=${currentCookie};path=/;samesite=none;secure=true;httponly;`
        )
    } catch (error) {
        res.status(400).send(getErrorMsg(error))
    }
}
