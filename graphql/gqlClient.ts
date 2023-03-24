import { GraphQLClient, RequestDocument } from 'graphql-request'

export const gqlClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!,
    // {
    //     credentials: 'include',
    //     mode: 'cors',
    // }
)

export const fetcher = (query: RequestDocument, ...args: any[]) => {
    //Create an object.Odd indexs are variables and even indexs are values.
    //Needs to be flat to avoid unnecessary rerendering since swr does shallow comparison.
    const variables = [...(args || [])].reduce((acc, arg, index, arr) => {
        if (index % 2 === 0) {
            acc[arg] = arr[index + 1]
        }
        return acc
    }, {})

    return gqlClient.request(query, variables)
}
