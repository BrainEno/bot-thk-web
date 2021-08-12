import queryString from 'query-string'
import { isAuth, handleResponse } from './auth'

export const createBlog = (blog, token) => {
    let createBlogEndpoint
    if (isAuth() && isAuth().role === 1) {
        createBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/blog`
    } else if (isAuth() && isAuth().role === 0) {
        createBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/user/blog`
    }

    return fetch(`${createBlogEndpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'appliaction/json',
            Authorization: `Bearer ${token}`,
        },
        body: blog,
    })
        .then((response) => {
            handleResponse(response)
            return response.json()
        })
        .catch((err) => console.log(err))
}

export const listRelated = (blog) => {
    return fetch(`${process.env.NEXT_PUBLIC_API}/blogs/related`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(blog),
    })
        .then((res) => {
            return res.json()
        })
        .catch((err) => console.log(err))
}

export const listBlogsWithCategoriesAndTags = (skip, limit) => {
    const data = {
        limit,
        skip,
    }

    return fetch(`${process.env.NEXT_PUBLIC_API}/blogs-categories-tags`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            return response.json()
        })
        .catch((err) => console.log(err))
}

export const singleBlog = (id = undefined) => {
    return fetch(`${process.env.NEXT_PUBLIC_API}/blog/${id}`, {
        method: 'GET',
    })
        .then((response) => {
            return response.json()
        })
        .catch((err) => console.log(err))
}

//列出用于类别卡片展示的博客
export const list = (username) => {
    let listBlogEndpoint

    if (username) {
        listBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/${username}/blogs`
    } else {
        listBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/blogs`
    }

    return fetch(`${listBlogEndpoint}`, {
        method: 'GET',
    })
        .then((res) => {
            return res.json()
        })
        .catch((err) => console.log(err))
}

//删除博客
export const removeBlog = (id, token) => {
    let deleteBlogEndpoint

    if (isAuth() && isAuth().role === 1) {
        deleteBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/blog/${id}`
    } else if (isAuth() && isAuth().role === 0) {
        deleteBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/user/blog/${id}`
    }

    return fetch(`${deleteBlogEndpoint}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            handleResponse(response)
            return response.json()
        })
        .catch((err) => console.log(err))
}

//更新博客
export const updateBlog = (blog, token, id) => {
    let updateBlogEndpoint

    if (isAuth() && isAuth().role === 1) {
        updateBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/blog/${id}`
    } else if (isAuth() && isAuth().role === 0) {
        updateBlogEndpoint = `${process.env.NEXT_PUBLIC_API}/user/blog/${id}`
    }

    return fetch(`${updateBlogEndpoint}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: blog,
    })
        .then((res) => {
            handleResponse(res)
            return res.json()
        })
        .catch((err) => console.log(err))
}

//搜索博客
export const listSearch = (params) => {
    console.log('search params', params)
    let query = queryString.stringify(params)
    console.log('query params', query)
    return fetch(`${process.env.NEXT_PUBLIC_API}/blogs/search?${query}`, {
        method: 'GET',
    })
        .then((res) => {
            return res.json()
        })
        .catch((err) => console.log(err))
}
