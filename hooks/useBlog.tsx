// import useSWR from 'swr'

// const fetchWithId = (url: string, id: string) =>
//     fetch(`${url}${id}`).then((res) => res.json())

// const useBlog = (id: string, initialData?: any) => {
//     return useSWR(
//         id ? [`${process.env.NEXT_PUBLIC_API}/blog/`, id] : null,
//         fetchWithId,
//         {
//             initialData,
//             refreshInterval: 0,
//         }
//     )
// }

// export default useBlog
export {}
