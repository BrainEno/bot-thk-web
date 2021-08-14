import useSWR from 'swr'

const fetcher = (resource: RequestInfo, init?: RequestInit) =>
    fetch(resource, init).then((res) => res.json())

const useBlog = (id: string, initialData?: any) => {
    console.log('blog id:', id)

    return useSWR(
        () => (id ? `${process.env.NEXT_PUBLIC_API}/blog/${id}` : null),
        fetcher,
        { initialData, refreshInterval: 0 }
    )
}

export default useBlog
