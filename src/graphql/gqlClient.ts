import { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { GraphQLClient, RequestDocument, Variables } from 'graphql-request'

export const GRAPHQL_ENDPOINT = process.env
    .NEXT_PUBLIC_GRAPHQL_ENDPOINT as string

export const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
    credentials: 'include',
    mode: 'cors',
})

export const fetcher =
    <TData,TVariables extends Variables>(
        query: RequestDocument | TypedDocumentNode<unknown, Variables>,
        variables?: TVariables
    ) =>
    async (): Promise<TData> =>
        await gqlClient.request<TData>(query, variables)
