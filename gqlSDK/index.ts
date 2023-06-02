import { gqlClient } from '../graphql/gqlClient'

import { getSdkWithHooks } from './sdk'

export const sdk = getSdkWithHooks(gqlClient)
