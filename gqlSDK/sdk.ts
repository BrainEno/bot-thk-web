import { GraphQLClient } from 'graphql-request'
import { ClientError } from 'graphql-request/build/esm/types'
import * as Dom from 'graphql-request/build/esm/types.dom'
import gql from 'graphql-tag'
import useSWR, {
    Key as SWRKeyInterface,
    SWRConfiguration as SWRConfigInterface,
} from 'swr'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
    DateTime: string
    ObjectId: any
}

export type Blog = {
    __typename?: 'Blog'
    _id: Scalars['ObjectId']
    active?: Maybe<Scalars['Boolean']>
    author: User
    body: Scalars['String']
    categories: Array<Category>
    comments?: Maybe<Array<Comment>>
    createdAt: Scalars['DateTime']
    description?: Maybe<Scalars['String']>
    image?: Maybe<Scalars['String']>
    imageUri?: Maybe<Scalars['String']>
    likedBy?: Maybe<Array<User>>
    mtitle: Scalars['String']
    slug: Scalars['String']
    tags: Array<Tag>
    title: Scalars['String']
    updatedAt: Scalars['DateTime']
}

export type BlogInput = {
    active: Scalars['Boolean']
    body: Scalars['String']
    imageUri?: InputMaybe<Scalars['String']>
    title: Scalars['String']
}

export type Category = {
    __typename?: 'Category'
    _id: Scalars['ObjectId']
    name: Scalars['String']
    slug: Scalars['String']
}

export type Comment = {
    __typename?: 'Comment'
    _id: Scalars['ObjectId']
    atBlog: Blog
    by: User
    content: Scalars['String']
    createdAt: Scalars['DateTime']
    updatedAt: Scalars['DateTime']
}

export type LoginRes = {
    __typename?: 'LoginRes'
    accessToken: Scalars['String']
}

export type Mutation = {
    __typename?: 'Mutation'
    createBlog: NewBlogRes
    deleteCat: Scalars['Boolean']
    deleteTag: Scalars['Boolean']
    editProfile: Scalars['Boolean']
    forgotPassword: Scalars['String']
    login: LoginRes
    newCat: Scalars['Boolean']
    newTag: Scalars['Boolean']
    register: Scalars['String']
    resetPassword: Scalars['Boolean']
    updateBlog: NewBlogRes
}

export type MutationCreateBlogArgs = {
    blogInput: BlogInput
    tagIds?: InputMaybe<Array<Scalars['String']>>
}

export type MutationDeleteCatArgs = {
    id: Scalars['String']
}

export type MutationDeleteTagArgs = {
    id: Scalars['String']
}

export type MutationEditProfileArgs = {
    about?: InputMaybe<Scalars['String']>
    email?: InputMaybe<Scalars['String']>
    name?: InputMaybe<Scalars['String']>
    photo?: InputMaybe<Scalars['String']>
}

export type MutationForgotPasswordArgs = {
    email: Scalars['String']
}

export type MutationLoginArgs = {
    email: Scalars['String']
    password: Scalars['String']
}

export type MutationNewCatArgs = {
    catName: Scalars['String']
}

export type MutationNewTagArgs = {
    tagName: Scalars['String']
}

export type MutationRegisterArgs = {
    email: Scalars['String']
    name: Scalars['String']
    password: Scalars['String']
}

export type MutationResetPasswordArgs = {
    password: Scalars['String']
    username: Scalars['String']
}

export type MutationUpdateBlogArgs = {
    blogId: Scalars['String']
    blogInput: BlogInput
    tagIds?: InputMaybe<Array<Scalars['String']>>
}

export type NewBlogRes = {
    __typename?: 'NewBlogRes'
    success: Scalars['Boolean']
}

export type Query = {
    __typename?: 'Query'
    currentUser?: Maybe<User>
    getBlogBySlug: Blog
    getBlogsByUsername: Array<Blog>
    getCatBlogs: Array<Blog>
    getRelatedBlogs: Array<Blog>
    getTagBlogs: Array<Blog>
    getUserBlogs: Array<Blog>
    hello: Scalars['String']
    listBlogsWithCatTag: Array<Blog>
    listCats: Array<Category>
    listTags: Array<Tag>
    searchBlogs: Array<Blog>
}

export type QueryGetBlogBySlugArgs = {
    slug: Scalars['String']
}

export type QueryGetBlogsByUsernameArgs = {
    username: Scalars['String']
}

export type QueryGetCatBlogsArgs = {
    slug: Scalars['String']
}

export type QueryGetRelatedBlogsArgs = {
    catIds: Array<Scalars['String']>
    limit?: InputMaybe<Scalars['Float']>
    slug: Scalars['String']
    tagIds: Array<Scalars['String']>
}

export type QueryGetTagBlogsArgs = {
    slug: Scalars['String']
}

export type QueryGetUserBlogsArgs = {
    userId: Scalars['String']
}

export type QuerySearchBlogsArgs = {
    query: Scalars['String']
}

export type Tag = {
    __typename?: 'Tag'
    _id: Scalars['ObjectId']
    name: Scalars['String']
    slug: Scalars['String']
}

export type User = {
    __typename?: 'User'
    _id: Scalars['ObjectId']
    about?: Maybe<Scalars['String']>
    commented: Array<Comment>
    createdAt: Scalars['DateTime']
    email: Scalars['String']
    name: Scalars['String']
    photo?: Maybe<Scalars['String']>
    profile: Scalars['String']
    resetPasswordLink?: Maybe<Scalars['String']>
    role: Scalars['String']
    updatedAt: Scalars['DateTime']
    username: Scalars['String']
}

export type RegisterMutationVariables = Exact<{
    registerPassword: Scalars['String']
    registerEmail: Scalars['String']
    registerName: Scalars['String']
}>

export type RegisterMutation = { __typename?: 'Mutation'; register: string }

export type LoginMutationVariables = Exact<{
    password: Scalars['String']
    email: Scalars['String']
}>

export type LoginMutation = {
    __typename?: 'Mutation'
    login: { __typename?: 'LoginRes'; accessToken: string }
}

export type CreateBlogMutationVariables = Exact<{
    blogInput: BlogInput
    tagIds?: InputMaybe<Array<Scalars['String']> | Scalars['String']>
}>

export type CreateBlogMutation = {
    __typename?: 'Mutation'
    createBlog: { __typename?: 'NewBlogRes'; success: boolean }
}

export type EditProfileMutationVariables = Exact<{
    about?: InputMaybe<Scalars['String']>
    name?: InputMaybe<Scalars['String']>
    photo?: InputMaybe<Scalars['String']>
    email?: InputMaybe<Scalars['String']>
}>

export type EditProfileMutation = {
    __typename?: 'Mutation'
    editProfile: boolean
}

export type ResetPasswordMutationVariables = Exact<{
    password: Scalars['String']
    username: Scalars['String']
}>

export type ResetPasswordMutation = {
    __typename?: 'Mutation'
    resetPassword: boolean
}

export type ForgotPasswordMutationVariables = Exact<{
    email: Scalars['String']
}>

export type ForgotPasswordMutation = {
    __typename?: 'Mutation'
    forgotPassword: string
}

export type DeleteTagMutationVariables = Exact<{
    deleteTagId: Scalars['String']
}>

export type DeleteTagMutation = { __typename?: 'Mutation'; deleteTag: boolean }

export type NewTagMutationVariables = Exact<{
    tagName: Scalars['String']
}>

export type NewTagMutation = { __typename?: 'Mutation'; newTag: boolean }

export type NewCatMutationVariables = Exact<{
    catName: Scalars['String']
}>

export type NewCatMutation = { __typename?: 'Mutation'; newCat: boolean }

export type DeleteCatMutationVariables = Exact<{
    deleteCatId: Scalars['String']
}>

export type DeleteCatMutation = { __typename?: 'Mutation'; deleteCat: boolean }

export type UpdateBlogMutationVariables = Exact<{
    blogInput: BlogInput
    blogId: Scalars['String']
    tagIds?: InputMaybe<Array<Scalars['String']> | Scalars['String']>
}>

export type UpdateBlogMutation = {
    __typename?: 'Mutation'
    updateBlog: { __typename?: 'NewBlogRes'; success: boolean }
}

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>

export type CurrentUserQuery = {
    __typename?: 'Query'
    currentUser?: {
        __typename?: 'User'
        _id: any
        username: string
        name: string
        email: string
        profile: string
        about?: string | null
        role: string
        photo?: string | null
        createdAt: string
        updatedAt: string
    } | null
}

export type GetCatBlogsQueryVariables = Exact<{
    getCatBlogsSlug: Scalars['String']
}>

export type GetCatBlogsQuery = {
    __typename?: 'Query'
    getCatBlogs: Array<{
        __typename?: 'Blog'
        _id: any
        createdAt: string
        updatedAt: string
        imageUri?: string | null
        mtitle: string
        description?: string | null
        slug: string
        title: string
        author: {
            __typename?: 'User'
            username: string
            name: string
            profile: string
        }
        tags: Array<{ __typename?: 'Tag'; name: string; slug: string }>
        categories: Array<{
            __typename?: 'Category'
            name: string
            slug: string
        }>
    }>
}

export type GetTagBlogsQueryVariables = Exact<{
    getTagBlogsSlug: Scalars['String']
}>

export type GetTagBlogsQuery = {
    __typename?: 'Query'
    getTagBlogs: Array<{
        __typename?: 'Blog'
        _id: any
        createdAt: string
        updatedAt: string
        imageUri?: string | null
        mtitle: string
        description?: string | null
        slug: string
        title: string
        author: {
            __typename?: 'User'
            username: string
            name: string
            profile: string
        }
        tags: Array<{ __typename?: 'Tag'; name: string; slug: string }>
        categories: Array<{
            __typename?: 'Category'
            name: string
            slug: string
        }>
    }>
}

export type GetBlogBySlugQueryVariables = Exact<{
    slug: Scalars['String']
}>

export type GetBlogByIdQueryVariables = Exact<{
    blogId: Scalars['String']
}>

export type GetBlogBySlugQuery = {
    __typename?: 'Query'
    getBlogBySlug: {
        __typename?: 'Blog'
        title: string
        slug: string
        description?: string | null
        body: string
        mtitle: string
        image?: string | null
        imageUri?: string | null
        active?: boolean | null
        _id: any
        createdAt: string
        updatedAt: string
        likedBy?: Array<{
            __typename?: 'User'
            username: string
            name: string
        }> | null
        comments?: Array<{
            __typename?: 'Comment'
            content: string
            by: { __typename?: 'User'; name: string; username: string }
            atBlog: { __typename?: 'Blog'; slug: string; title: string }
        }> | null
        author: { __typename?: 'User'; name: string; username: string }
        tags: Array<{
            __typename?: 'Tag'
            _id: any
            slug: string
            name: string
        }>
        categories: Array<{
            __typename?: 'Category'
            _id: any
            slug: string
            name: string
        }>
    }
}

export type GetBlogByIdQuery = {
    __typename?: 'Query'
    getBlogById: {
        __typename?: 'Blog'
        title: string
        slug: string
        description?: string | null
        body: string
        mtitle: string
        image?: string | null
        imageUri?: string | null
        active?: boolean | null
        _id: any
        createdAt: string
        updatedAt: string
        author: { __typename?: 'User'; name: string; username: string }
        tags: Array<{
            __typename?: 'Tag'
            _id: any
            slug: string
            name: string
        }>
        categories: Array<{
            __typename?: 'Category'
            _id: any
            slug: string
            name: string
        }>
    }
}

export type ListBlogsWithCatTagQueryVariables = Exact<{ [key: string]: never }>

export type ListBlogsWithCatTagQuery = {
    __typename?: 'Query'
    listBlogsWithCatTag: Array<{
        __typename?: 'Blog'
        title: string
        description?: string | null
        body: string
        slug: string
        _id: any
        mtitle: string
        image?: string | null
        imageUri?: string | null
        active?: boolean | null
        createdAt: string
        updatedAt: string
        author: { __typename?: 'User'; name: string; profile: string }
        categories: Array<{
            __typename?: 'Category'
            slug: string
            name: string
        }>
        tags: Array<{ __typename?: 'Tag'; slug: string; name: string }>
    }>
}

export type GetRelatedBlogsQueryVariables = Exact<{
    limit?: InputMaybe<Scalars['Float']>
    tagIds: Array<Scalars['String']> | Scalars['String']
    catIds: Array<Scalars['String']> | Scalars['String']
    getRelatedBlogsSlug: Scalars['String']
}>

export type GetRelatedBlogsQuery = {
    __typename?: 'Query'
    getRelatedBlogs: Array<{
        __typename?: 'Blog'
        imageUri?: string | null
        _id: any
        slug: string
        tags: Array<{ __typename?: 'Tag'; slug: string; name: string }>
    }>
}

export type SearchBlogsQueryVariables = Exact<{
    query: Scalars['String']
}>

export type SearchBlogsQuery = {
    __typename?: 'Query'
    searchBlogs: Array<{
        __typename?: 'Blog'
        slug: string
        title: string
        author: { __typename?: 'User'; name: string }
    }>
}

export type GetUserBlogsQueryVariables = Exact<{
    userId: Scalars['String']
}>

export type GetUserBlogsQuery = {
    __typename?: 'Query'
    getUserBlogs: Array<{
        __typename?: 'Blog'
        _id: any
        active?: boolean | null
        createdAt: string
        description?: string | null
        slug: string
        title: string
        author: { __typename?: 'User'; name: string }
    }>
}

export type ListTagsQueryVariables = Exact<{ [key: string]: never }>

export type ListTagsQuery = {
    __typename?: 'Query'
    listTags: Array<{
        __typename?: 'Tag'
        name: string
        slug: string
        _id: any
    }>
}

export type ListCatsQueryVariables = Exact<{ [key: string]: never }>

export type ListCatsQuery = {
    __typename?: 'Query'
    listCats: Array<{
        __typename?: 'Category'
        name: string
        _id: any
        slug: string
    }>
}

export const RegisterDocument = gql`
    mutation Register(
        $registerPassword: String!
        $registerEmail: String!
        $registerName: String!
    ) {
        register(
            password: $registerPassword
            email: $registerEmail
            name: $registerName
        )
    }
`
export const LoginDocument = gql`
    mutation Login($password: String!, $email: String!) {
        login(password: $password, email: $email) {
            accessToken
        }
    }
`
export const CreateBlogDocument = gql`
    mutation CreateBlog($blogInput: BlogInput!, $tagIds: [String!]) {
        createBlog(blogInput: $blogInput, tagIds: $tagIds) {
            success
        }
    }
`
export const EditProfileDocument = gql`
    mutation EditProfile(
        $about: String
        $name: String
        $photo: String
        $email: String
    ) {
        editProfile(about: $about, name: $name, photo: $photo, email: $email)
    }
`
export const ResetPasswordDocument = gql`
    mutation ResetPassword($password: String!, $username: String!) {
        resetPassword(password: $password, username: $username)
    }
`
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(email: $email)
    }
`
export const DeleteTagDocument = gql`
    mutation DeleteTag($deleteTagId: String!) {
        deleteTag(id: $deleteTagId)
    }
`
export const NewTagDocument = gql`
    mutation NewTag($tagName: String!) {
        newTag(tagName: $tagName)
    }
`
export const NewCatDocument = gql`
    mutation NewCat($catName: String!) {
        newCat(catName: $catName)
    }
`
export const DeleteCatDocument = gql`
    mutation DeleteCat($deleteCatId: String!) {
        deleteCat(id: $deleteCatId)
    }
`
export const UpdateBlogDocument = gql`
    mutation UpdateBlog(
        $blogInput: BlogInput!
        $blogId: String!
        $tagIds: [String!]
    ) {
        updateBlog(blogInput: $blogInput, blogId: $blogId, tagIds: $tagIds) {
            success
        }
    }
`
export const CurrentUserDocument = gql`
    query CurrentUser {
        currentUser {
            _id
            username
            name
            email
            profile
            about
            role
            photo
            createdAt
            updatedAt
        }
    }
`
export const GetCatBlogsDocument = gql`
    query GetCatBlogs($getCatBlogsSlug: String!) {
        getCatBlogs(slug: $getCatBlogsSlug) {
            _id
            createdAt
            updatedAt
            author {
                username
                name
                profile
            }
            tags {
                name
                slug
            }
            categories {
                name
                slug
            }
            imageUri
            mtitle
            description
            slug
            title
        }
    }
`
export const GetTagBlogsDocument = gql`
    query GetTagBlogs($getTagBlogsSlug: String!) {
        getTagBlogs(slug: $getTagBlogsSlug) {
            _id
            createdAt
            updatedAt
            author {
                username
                name
                profile
            }
            tags {
                name
                slug
            }
            categories {
                name
                slug
            }
            imageUri
            mtitle
            description
            slug
            title
        }
    }
`
export const GetBlogBySlugDocument = gql`
    query GetBlogBySlug($slug: String!) {
        getBlogBySlug(slug: $slug) {
            title
            slug
            description
            body
            mtitle
            image
            imageUri
            active
            likedBy {
                username
                name
            }
            comments {
                content
                by {
                    name
                    username
                }
                atBlog {
                    slug
                    title
                }
            }
            _id
            createdAt
            updatedAt
            author {
                name
                username
            }
            tags {
                _id
                slug
                name
            }
            categories {
                _id
                slug
                name
            }
        }
    }
`

export const GetBlogByIdDocument = gql`
    query GetBlogById($blogId: String!) {
        getBlogById(blogId: $blogId) {
            title
            slug
            description
            body
            mtitle
            image
            imageUri
            active
            _id
            createdAt
            updatedAt
            author {
                name
                username
            }
            tags {
                _id
                slug
                name
            }
            categories {
                _id
                slug
                name
            }
        }
    }
`

export const ListBlogsWithCatTagDocument = gql`
    query ListBlogsWithCatTag {
        listBlogsWithCatTag {
            title
            description
            body
            slug
            _id
            mtitle
            image
            imageUri
            active
            createdAt
            updatedAt
            author {
                name
                profile
            }
            categories {
                slug
                name
            }
            tags {
                slug
                name
            }
        }
    }
`
export const GetRelatedBlogsDocument = gql`
    query GetRelatedBlogs(
        $limit: Float
        $tagIds: [String!]!
        $catIds: [String!]!
        $getRelatedBlogsSlug: String!
    ) {
        getRelatedBlogs(
            limit: $limit
            tagIds: $tagIds
            catIds: $catIds
            slug: $getRelatedBlogsSlug
        ) {
            imageUri
            _id
            slug
            tags {
                slug
                name
            }
        }
    }
`
export const SearchBlogsDocument = gql`
    query SearchBlogs($query: String!) {
        searchBlogs(query: $query) {
            slug
            title
            author {
                name
            }
        }
    }
`
export const GetUserBlogsDocument = gql`
    query GetUserBlogs($userId: String!) {
        getUserBlogs(userId: $userId) {
            _id
            active
            author {
                name
            }
            createdAt
            description
            slug
            title
        }
    }
`
export const ListTagsDocument = gql`
    query ListTags {
        listTags {
            name
            slug
            _id
        }
    }
`
export const ListCatsDocument = gql`
    query ListCats {
        listCats {
            name
            _id
            slug
        }
    }
`

export type SdkFunctionWrapper = <T>(
    action: (requestHeaders?: Record<string, string>) => Promise<T>,
    operationName: string,
    operationType?: string
) => Promise<T>

const defaultWrapper: SdkFunctionWrapper = (
    action,
    _operationName,
    _operationType
) => action()

export function getSdk(
    client: GraphQLClient,
    withWrapper: SdkFunctionWrapper = defaultWrapper
) {
    return {
        Register(
            variables: RegisterMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<RegisterMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<RegisterMutation>(
                        RegisterDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'Register',
                'mutation'
            )
        },
        Login(
            variables: LoginMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<LoginMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<LoginMutation>(LoginDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                'Login',
                'mutation'
            )
        },
        CreateBlog(
            variables: CreateBlogMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<CreateBlogMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<CreateBlogMutation>(
                        CreateBlogDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'CreateBlog',
                'mutation'
            )
        },
        EditProfile(
            variables?: EditProfileMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<EditProfileMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<EditProfileMutation>(
                        EditProfileDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'EditProfile',
                'mutation'
            )
        },
        ResetPassword(
            variables: ResetPasswordMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<ResetPasswordMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<ResetPasswordMutation>(
                        ResetPasswordDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'ResetPassword',
                'mutation'
            )
        },
        ForgotPassword(
            variables: ForgotPasswordMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<ForgotPasswordMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<ForgotPasswordMutation>(
                        ForgotPasswordDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'ForgotPassword',
                'mutation'
            )
        },
        DeleteTag(
            variables: DeleteTagMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<DeleteTagMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<DeleteTagMutation>(
                        DeleteTagDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'DeleteTag',
                'mutation'
            )
        },
        NewTag(
            variables: NewTagMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<NewTagMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<NewTagMutation>(NewTagDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                'NewTag',
                'mutation'
            )
        },
        NewCat(
            variables: NewCatMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<NewCatMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<NewCatMutation>(NewCatDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                'NewCat',
                'mutation'
            )
        },
        DeleteCat(
            variables: DeleteCatMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<DeleteCatMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<DeleteCatMutation>(
                        DeleteCatDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'DeleteCat',
                'mutation'
            )
        },
        UpdateBlog(
            variables: UpdateBlogMutationVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<UpdateBlogMutation> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<UpdateBlogMutation>(
                        UpdateBlogDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'UpdateBlog',
                'mutation'
            )
        },
        CurrentUser(
            variables?: CurrentUserQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<CurrentUserQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<CurrentUserQuery>(
                        CurrentUserDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'CurrentUser',
                'query'
            )
        },
        GetCatBlogs(
            variables: GetCatBlogsQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<GetCatBlogsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetCatBlogsQuery>(
                        GetCatBlogsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'GetCatBlogs',
                'query'
            )
        },
        GetTagBlogs(
            variables: GetTagBlogsQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<GetTagBlogsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetTagBlogsQuery>(
                        GetTagBlogsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'GetTagBlogs',
                'query'
            )
        },
        GetBlogBySlug(
            variables: GetBlogBySlugQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<GetBlogBySlugQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetBlogBySlugQuery>(
                        GetBlogBySlugDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'GetBlogBySlug',
                'query'
            )
        },
        GetBlogById(
            variables: GetBlogByIdQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<GetBlogByIdQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetBlogByIdQuery>(
                        GetBlogByIdDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'GetBlogById',
                'query'
            )
        },
        ListBlogsWithCatTag(
            variables?: ListBlogsWithCatTagQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<ListBlogsWithCatTagQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<ListBlogsWithCatTagQuery>(
                        ListBlogsWithCatTagDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'ListBlogsWithCatTag',
                'query'
            )
        },
        GetRelatedBlogs(
            variables: GetRelatedBlogsQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<GetRelatedBlogsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetRelatedBlogsQuery>(
                        GetRelatedBlogsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'GetRelatedBlogs',
                'query'
            )
        },
        SearchBlogs(
            variables: SearchBlogsQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<SearchBlogsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<SearchBlogsQuery>(
                        SearchBlogsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'SearchBlogs',
                'query'
            )
        },
        GetUserBlogs(
            variables: GetUserBlogsQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<GetUserBlogsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<GetUserBlogsQuery>(
                        GetUserBlogsDocument,
                        variables,
                        { ...requestHeaders, ...wrappedRequestHeaders }
                    ),
                'GetUserBlogs',
                'query'
            )
        },
        ListTags(
            variables?: ListTagsQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<ListTagsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<ListTagsQuery>(ListTagsDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                'ListTags',
                'query'
            )
        },
        ListCats(
            variables?: ListCatsQueryVariables,
            requestHeaders?: Dom.RequestInit['headers']
        ): Promise<ListCatsQuery> {
            return withWrapper(
                (wrappedRequestHeaders) =>
                    client.request<ListCatsQuery>(ListCatsDocument, variables, {
                        ...requestHeaders,
                        ...wrappedRequestHeaders,
                    }),
                'ListCats',
                'query'
            )
        },
    }
}
export type Sdk = ReturnType<typeof getSdk>
export function getSdkWithHooks(
    client: GraphQLClient,
    withWrapper: SdkFunctionWrapper = defaultWrapper
) {
    const sdk = getSdk(client, withWrapper)
    return {
        ...sdk,
        useCurrentUser(
            key: SWRKeyInterface,
            variables?: CurrentUserQueryVariables,
            config?: SWRConfigInterface<CurrentUserQuery, ClientError>
        ) {
            return useSWR<CurrentUserQuery, ClientError>(
                key,
                () => sdk.CurrentUser(variables),
                config
            )
        },
        useGetCatBlogs(
            key: SWRKeyInterface,
            variables: GetCatBlogsQueryVariables,
            config?: SWRConfigInterface<GetCatBlogsQuery, ClientError>
        ) {
            return useSWR<GetCatBlogsQuery, ClientError>(
                key,
                () => sdk.GetCatBlogs(variables),
                config
            )
        },
        useGetTagBlogs(
            key: SWRKeyInterface,
            variables: GetTagBlogsQueryVariables,
            config?: SWRConfigInterface<GetTagBlogsQuery, ClientError>
        ) {
            return useSWR<GetTagBlogsQuery, ClientError>(
                key,
                () => sdk.GetTagBlogs(variables),
                config
            )
        },
        useGetBlogBySlug(
            key: SWRKeyInterface,
            variables: GetBlogBySlugQueryVariables,
            config?: SWRConfigInterface<GetBlogBySlugQuery, ClientError>
        ) {
            return useSWR<GetBlogBySlugQuery, ClientError>(
                key,
                () => sdk.GetBlogBySlug(variables),
                config
            )
        },
        useGetBlogById(
            key: SWRKeyInterface,
            variables: GetBlogByIdQueryVariables,
            config?: SWRConfigInterface<GetBlogByIdQuery, ClientError>
        ) {
            return useSWR<GetBlogByIdQuery, ClientError>(
                key,
                () => sdk.GetBlogById(variables),
                config
            )
        },
        useListBlogsWithCatTag(
            key: SWRKeyInterface,
            variables?: ListBlogsWithCatTagQueryVariables,
            config?: SWRConfigInterface<ListBlogsWithCatTagQuery, ClientError>
        ) {
            return useSWR<ListBlogsWithCatTagQuery, ClientError>(
                key,
                () => sdk.ListBlogsWithCatTag(variables),
                config
            )
        },
        useGetRelatedBlogs(
            key: SWRKeyInterface,
            variables: GetRelatedBlogsQueryVariables,
            config?: SWRConfigInterface<GetRelatedBlogsQuery, ClientError>
        ) {
            return useSWR<GetRelatedBlogsQuery, ClientError>(
                key,
                () => sdk.GetRelatedBlogs(variables),
                config
            )
        },
        useSearchBlogs(
            key: SWRKeyInterface,
            variables: SearchBlogsQueryVariables,
            config?: SWRConfigInterface<SearchBlogsQuery, ClientError>
        ) {
            return useSWR<SearchBlogsQuery, ClientError>(
                key,
                () => sdk.SearchBlogs(variables),
                config
            )
        },
        useGetUserBlogs(
            key: SWRKeyInterface,
            variables: GetUserBlogsQueryVariables,
            config?: SWRConfigInterface<GetUserBlogsQuery, ClientError>
        ) {
            return useSWR<GetUserBlogsQuery, ClientError>(
                key,
                () => sdk.GetUserBlogs(variables),
                config
            )
        },
        useListTags(
            key: SWRKeyInterface,
            variables?: ListTagsQueryVariables,
            config?: SWRConfigInterface<ListTagsQuery, ClientError>
        ) {
            return useSWR<ListTagsQuery, ClientError>(
                key,
                () => sdk.ListTags(variables),
                config
            )
        },
        useListCats(
            key: SWRKeyInterface,
            variables?: ListCatsQueryVariables,
            config?: SWRConfigInterface<ListCatsQuery, ClientError>
        ) {
            return useSWR<ListCatsQuery, ClientError>(
                key,
                () => sdk.ListCats(variables),
                config
            )
        },
    }
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>
