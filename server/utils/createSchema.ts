import { buildSchema } from 'type-graphql'
import UserResolvers from '../resolvers/UserResolvers'

export const createSchema = () => buildSchema({ resolvers: [UserResolvers] })
