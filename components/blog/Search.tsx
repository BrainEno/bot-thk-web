import Link from 'next/link'
import { SearchOutlined } from '@ant-design/icons'
import React, { useState, useRef, useEffect } from 'react'
import { listSearch } from '../../actions/blog'
import classNames from 'classnames'
import { IBlog } from '../../types'

const Search = () => {
    const [values, setValues] = useState<{
        search: string
        results: IBlog[]
        searched: boolean
        message: string
    }>({
        search: '',
        results: [],
        searched: false,
        message: '',
    })

    const { search, results, searched, message } = values

    const searchSubmit: React.FormEventHandler = (e) => {
        e.preventDefault()

        listSearch({ search }).then((data) => {
            setValues({
                ...values,
                results: data,
                searched: true,
                message: `共发现   ${data.length}  条结果,点击跳转`,
            })
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            search: e.target.value,
            searched: false,
            results: [],
        })
    }

    const ref = useRef<null | HTMLDivElement>(null)

    const handleClickOutside = (e: any) => {
        if (ref.current && !ref.current!.contains(e.target)) {
            setValues({ ...values, searched: false })
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true)
        return () => {
            document.removeEventListener('click', handleClickOutside, true)
        }
    }, [ref, values])

    const searchedBlogs = (results: IBlog[] = []) => {
        return (
            <div className="drop">
                {message && <p>{message}</p>}

                {results &&
                    results.map((blog: IBlog, i: number) => {
                        return (
                            <div
                                key={i}
                                className="drop-items"
                                style={{ display: { searched } ? '' : 'none' }}
                            >
                                <Link href={`/blogs/${blog._id}`}>
                                    <a
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
                                    </a>
                                </Link>
                            </div>
                        )
                    })}
            </div>
        )
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit} className="search-form">
            <div
                className={classNames('search-container', {
                    searched: searched,
                })}
            >
                <SearchOutlined
                    as="button"
                    type="submit"
                    onClick={searchSubmit}
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
                    {searchedBlogs(results)}
                </div>
            )}
        </div>
    )
}

export default Search
