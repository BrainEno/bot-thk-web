import Credentials from '@auth/core/providers/credentials'

import { sdk } from '../../../generated/sdk'
import { getErrorMsg } from '../../../helpers/getErrorMsg'

async function refreshAccessToken(userId: string) {
    try {
        const tokenResponse = await sdk.RefreshToken({ userId })

        return {
            accessToken: tokenResponse.refreshToken.accessToken,
        }
    } catch (error) {
        return {
            userId,
            error: 'RefreshAccessTokenError',
        }
    }
}

const providers = [
    Credentials({
        name: 'Credentials',
        authorize: async (credentials) => {
            try {
                const res = await sdk.Login({
                    email: credentials.email as string,
                    password: credentials.password as string,
                })

                if (res.login.ok) {
                    const { currentUser: user } = await sdk.CurrentUser()

                    if (user)
                        return {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            image: user.photo,
                        }
                }
                return null
            } catch (err) {
                throw new Error(getErrorMsg(err))
            }
        },
    }),
]

// const callbacks={
//     jwt:async ({token,user})=>{
//         if(user){
//             token.accessToken=user.
//         }
//     }
// }
