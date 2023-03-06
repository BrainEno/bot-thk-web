import { useMemo } from 'react';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client';
import { onError } from '@apollo/link-error';
import { createUploadLink } from 'apollo-upload-client';
import merge from 'deepmerge';
import { IncomingHttpHeaders } from 'http';
import { isEqual } from 'lodash';
import type { AppProps } from 'next/app';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

const createApolloClient = (headers: IncomingHttpHeaders | null = null) => {
  const enhancedFetch = (url: RequestInfo, init: RequestInit) => {
    return fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        'Access-Control-Allow-Origin': '*',
        //here we pass the cookie along for each request
        Cookie: headers?.cookie ?? ''
      }
    }).then((response) => response);
  };

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
          graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]:Message: ${message},Location: ${locations},Path:${path}`
            )
          );

        if (networkError)
          console.log(
            `[Network error]:${networkError}. Backend is unreachable.Is it running?`
          );
      }) as any,
      createUploadLink({
        uri: '/api/graphql',
        //Make sure that CORS and cookies work
        fetchOptions: {
          mode: 'cors'
        },
        credentials: 'include',
        fetch: enhancedFetch
      })
    ]),
    cache: new InMemoryCache()
  });
};

type InitialState = NormalizedCacheObject | undefined;

interface IInitializeApollo {
  headers?: IncomingHttpHeaders | null;
  initialState?: InitialState | null;
}

export function initializeApollo(
  { headers, initialState }: IInitializeApollo = {
    headers: null,
    initialState: null
  }
) {
  const _apolloClient = apolloClient ?? createApolloClient(headers);

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState!, existingCache, {
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        )
      ]
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export type APState={"__APOLLO_STATE__"?:NormalizedCacheObject}

export const addApolloState=(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: AppProps<{props?:APState}>['pageProps']
) =>{
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps: AppProps<APState>['pageProps']) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo({initialState:state}), [state]);
  return store;
}
