import React from 'react'
import { Provider } from 'urql'

import useUrqlClient from '../../hooks/useUrqlClient'

interface GraphqlProviderProps {
    children: React.ReactNode
}

const GraphqlProvider: React.FC<GraphqlProviderProps> = ({ children }) => {
    const client = useUrqlClient()

    return <Provider value={client}>{children}</Provider>
}

export default GraphqlProvider
