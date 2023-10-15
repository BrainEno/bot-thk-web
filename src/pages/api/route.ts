import NextAuth from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
