import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { getCookie } from 'cookies-next'
import { GraphQLClient, RequestDocument, Variables } from 'graphql-request'

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string

export const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
    credentials: 'include',
    mode: 'cors',
    headers: {
        Authrization: `Bearer ${getCookie('botthk')}`,
    },
})

export const fetcher =
    <TData, TVariables extends Variables>(
        query: RequestDocument | TypedDocumentNode<unknown, Variables>,
        variables?: TVariables
    ) =>
    async (): Promise<TData> =>
        await gqlClient.request<TData>(query, variables)
