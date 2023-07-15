import { gqlClient } from '../graphql/gqlClient'

import { getSdk } from './graphql-request'

export const sdk = getSdk(gqlClient)
