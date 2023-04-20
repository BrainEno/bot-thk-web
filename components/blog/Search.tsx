import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import classNames from 'classnames'
import Link from 'next/link'

import { getSdkWithHooks } from '../../gql/sdk'
import { gqlClient } from '../../graphql/gqlClient'
import { getErrorMsg } from '../../helpers/getErrorMsg'

const sdk = getSdkWithHooks(gqlClient)

type SearchBlogsRes = Array<{
    __typename?: 'Blog'
    slug: string
    title: string
    author: { __typename?: 'User'; name: string }
}>

const Search = () => {
    const [values, setValues] = useState<{
        search: string
        results: SearchBlogsRes
        searched: boolean
        message: string
    }>({
        search: '',
        results: [],
        searched: false,
        message: '',
    })
    const { search, results, searched, message } = values

    const { data, error, mutate } = sdk.useSearchBlogs(
        search ? `blogs/search` : null,
        {
            query: search,
        },
        {
            refreshInterval: 60,
            revalidateOnFocus: true,
        }
    )

    const searchSubmit: React.FormEventHandler = useCallback(
        (e) => {
            e.preventDefault()
            if (!data) {
                return
            }
            setValues({
                ...values,
                results: data.searchBlogs,
                searched: true,
                message: `共发现   ${data.searchBlogs.length}  条结果,点击跳转`,
            })

            mutate()
        },
        [data, mutate, values]
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (error) {
            setValues({
                ...values,
                searched: true,
                results: [],
                message: getErrorMsg(error),
            })
        }
        setValues({
            ...values,
            search: e.target.value,
            searched: false,
            results: [],
        })
    }

    const ref = useRef<null | HTMLDivElement>(null)

    const handleClickOutside = useCallback(
        (e: any) => {
            if (ref.current && !ref.current!.contains(e.target)) {
                setValues((values) => ({ ...values, searched: false }))
            }
        },
        [ref]
    )

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [ref, handleClickOutside])

    const searchForm = () => (
        <form onSubmit={searchSubmit} className="search-form">
            <div
                className={classNames('search-container', {
                    searched: searched,
                })}
            >
                <AiOutlineSearch
                    className="search-icon"
                    size={20}
                    color="#5b5b5b"
                    type="submit"
                    onClick={searchSubmit}
                    style={{
                        cursor: 'pointer',
                        margin: '0 10px',
                    }}
                />
                <input
                    type="text"
                    value={search}
                    className={'search-input'}
                    onChange={handleChange}
                />
            </div>
        </form>
    )

    return (
        <div className="search">
            {searchForm()}
            {searched && (
                <div className="searched" ref={ref}>
                    <div className="drop">
                        {message && <p>{message}</p>}

                        {results &&
                            results.map((blog, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="drop-items"
                                        style={{
                                            display: searched ? 'flex' : 'none',
                                        }}
                                    >
                                        <Link
                                            href={`/blogs/${blog.slug}`}
                                            className="title-text"
                                            onClick={() => {
                                                setValues({
                                                    ...values,
                                                    search: '',
                                                    results: [],
                                                    searched: false,
                                                })
                                            }}
                                        >
                                            {blog.title}
                                        </Link>
                                    </div>
                                )
                            })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Search
