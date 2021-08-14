import useSWR from 'swr'

const fetcher = async (
    input: RequestInfo,
    init?: RequestInit
): Promise<any> => {
    const res = await fetch(input, init)
    return res.json()
}

const useBlog = (id: string) => {
    return useSWR(
        () => (id ? `${process.env.NEXT_PUBLIC_API}/blog/${id}` : null),
        fetcher
    )
}

export default useBlog
