import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  ObjectId: any;
};

export type Blog = {
  __typename?: 'Blog';
  _id: Scalars['ObjectId'];
  active?: Maybe<Scalars['Boolean']>;
  author: User;
  body: Scalars['String'];
  categories: Array<Category>;
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  imageUri?: Maybe<Scalars['String']>;
  likedBy?: Maybe<Array<User>>;
  mtitle: Scalars['String'];
  slug: Scalars['String'];
  tags: Array<Tag>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type BlogInput = {
  active: Scalars['Boolean'];
  body: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  imageUri?: InputMaybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['ObjectId'];
  atBlog: Blog;
  by: User;
  content: Scalars['String'];
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBlog: Blog;
  login: LoginResponse;
  register: Scalars['Boolean'];
};


export type MutationCreateBlogArgs = {
  blog: BlogInput;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
  getBlogBySlug: Blog;
  getCatBlogs: Array<Blog>;
  getRelatedBlogs: Array<Blog>;
  hello: Scalars['String'];
  listBlogsWithCatTag: Array<Blog>;
};


export type QueryGetBlogBySlugArgs = {
  slug: Scalars['String'];
};


export type QueryGetCatBlogsArgs = {
  slug: Scalars['String'];
};


export type QueryGetRelatedBlogsArgs = {
  catIds: Array<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  slug: Scalars['String'];
  tagIds: Array<Scalars['String']>;
};

export type Tag = {
  __typename?: 'Tag';
  _id: Scalars['ObjectId'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId'];
  about?: Maybe<Scalars['String']>;
  commented: Array<Comment>;
  email: Scalars['String'];
  name: Scalars['String'];
  photo?: Maybe<Scalars['String']>;
  profile: Scalars['String'];
  resetPasswordLink?: Maybe<Scalars['String']>;
  role: Scalars['String'];
  username: Scalars['String'];
};

export type RegisterMutationVariables = Exact<{
  registerPassword: Scalars['String'];
  registerEmail: Scalars['String'];
  registerName: Scalars['String'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: boolean };

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  email: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', username: string, name: string, email: string, profile: string, about?: string | null, role: string, photo?: string | null } | null };

export type GetCatBlogsQueryVariables = Exact<{
  getCatBlogsSlug: Scalars['String'];
}>;


export type GetCatBlogsQuery = { __typename?: 'Query', getCatBlogs: Array<{ __typename?: 'Blog', _id: any, createdAt: any, updatedAt: any, imageUri?: string | null, mtitle: string, description?: string | null, slug: string, title: string, author: { __typename?: 'User', username: string, name: string, profile: string }, tags: Array<{ __typename?: 'Tag', name: string, slug: string }>, categories: Array<{ __typename?: 'Category', name: string, slug: string }> }> };

export type GetBlogBySlugQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GetBlogBySlugQuery = { __typename?: 'Query', getBlogBySlug: { __typename?: 'Blog', title: string, slug: string, description?: string | null, body: string, mtitle: string, image?: string | null, imageUri?: string | null, active?: boolean | null, _id: any, createdAt: any, updatedAt: any, likedBy?: Array<{ __typename?: 'User', username: string, name: string }> | null, comments?: Array<{ __typename?: 'Comment', content: string, by: { __typename?: 'User', name: string, username: string }, atBlog: { __typename?: 'Blog', slug: string, title: string } }> | null, author: { __typename?: 'User', name: string, username: string }, tags: Array<{ __typename?: 'Tag', _id: any, slug: string, name: string }>, categories: Array<{ __typename?: 'Category', _id: any, slug: string, name: string }> } };

export type ListBlogsWithCatTagQueryVariables = Exact<{ [key: string]: never; }>;


export type ListBlogsWithCatTagQuery = { __typename?: 'Query', listBlogsWithCatTag: Array<{ __typename?: 'Blog', title: string, description?: string | null, body: string, slug: string, _id: any, mtitle: string, image?: string | null, imageUri?: string | null, active?: boolean | null, createdAt: any, updatedAt: any, author: { __typename?: 'User', name: string }, categories: Array<{ __typename?: 'Category', slug: string, name: string }>, tags: Array<{ __typename?: 'Tag', slug: string, name: string }> }> };

export type GetRelatedBlogsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Float']>;
  tagIds: Array<Scalars['String']> | Scalars['String'];
  catIds: Array<Scalars['String']> | Scalars['String'];
  getRelatedBlogsSlug: Scalars['String'];
}>;


export type GetRelatedBlogsQuery = { __typename?: 'Query', getRelatedBlogs: Array<{ __typename?: 'Blog', imageUri?: string | null, _id: any, slug: string, tags: Array<{ __typename?: 'Tag', slug: string, name: string }> }> };


export const RegisterDocument = gql`
    mutation Register($registerPassword: String!, $registerEmail: String!, $registerName: String!) {
  register(
    password: $registerPassword
    email: $registerEmail
    name: $registerName
  )
}
    `;
export const LoginDocument = gql`
    mutation Login($password: String!, $email: String!) {
  login(password: $password, email: $email) {
    accessToken
  }
}
    `;
export const CurrentUserDocument = gql`
    query CurrentUser {
  currentUser {
    username
    name
    email
    profile
    about
    role
    photo
  }
}
    `;
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
    `;
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
    `;
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
    `;
export const GetRelatedBlogsDocument = gql`
    query GetRelatedBlogs($limit: Float, $tagIds: [String!]!, $catIds: [String!]!, $getRelatedBlogsSlug: String!) {
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
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Register(variables: RegisterMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegisterMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterMutation>(RegisterDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Register', 'mutation');
    },
    Login(variables: LoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>(LoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Login', 'mutation');
    },
    CurrentUser(variables?: CurrentUserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CurrentUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurrentUserQuery>(CurrentUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CurrentUser', 'query');
    },
    GetCatBlogs(variables: GetCatBlogsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetCatBlogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCatBlogsQuery>(GetCatBlogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetCatBlogs', 'query');
    },
    GetBlogBySlug(variables: GetBlogBySlugQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetBlogBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBlogBySlugQuery>(GetBlogBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetBlogBySlug', 'query');
    },
    ListBlogsWithCatTag(variables?: ListBlogsWithCatTagQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ListBlogsWithCatTagQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListBlogsWithCatTagQuery>(ListBlogsWithCatTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ListBlogsWithCatTag', 'query');
    },
    GetRelatedBlogs(variables: GetRelatedBlogsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRelatedBlogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRelatedBlogsQuery>(GetRelatedBlogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetRelatedBlogs', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
