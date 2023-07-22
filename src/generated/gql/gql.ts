/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "mutation Register($registerPassword: String!, $registerEmail: String!, $registerName: String!) {\n  register(\n    password: $registerPassword\n    email: $registerEmail\n    name: $registerName\n  )\n}\n\nmutation Login($password: String!, $email: String!) {\n  login(password: $password, email: $email) {\n    accessToken\n    ok\n  }\n}\n\nmutation CreateBlog($blogInput: BlogInput!, $tagIds: [String!]) {\n  createBlog(blogInput: $blogInput, tagIds: $tagIds) {\n    success\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nmutation RefreshToken {\n  refreshToken {\n    ok\n    accessToken\n  }\n}\n\nmutation EditProfile($about: String, $name: String, $photo: String, $email: String) {\n  editProfile(about: $about, name: $name, photo: $photo, email: $email)\n}\n\nmutation ResetPassword($password: String!, $username: String!) {\n  resetPassword(password: $password, username: $username)\n}\n\nmutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}\n\nmutation DeleteTag($deleteTagId: String!) {\n  deleteTag(id: $deleteTagId)\n}\n\nmutation NewTag($tagName: String!) {\n  newTag(tagName: $tagName)\n}\n\nmutation NewCat($catName: String!) {\n  newCat(catName: $catName)\n}\n\nmutation DeleteCat($deleteCatId: String!) {\n  deleteCat(id: $deleteCatId)\n}\n\nmutation UpdateBlog($blogInput: BlogInput!, $blogId: String!, $tagIds: [String!]) {\n  updateBlog(blogInput: $blogInput, blogId: $blogId, tagIds: $tagIds) {\n    success\n  }\n}\n\nmutation DeleteBlogById($blogId: String!) {\n  deleteBlogById(blogId: $blogId)\n}\n\nmutation Follow($followName: String!) {\n  follow(followName: $followName)\n}\n\nmutation UnFollow($name: String!) {\n  unFollow(name: $name)\n}": types.RegisterDocument,
    "query CurrentUser {\n  currentUser {\n    _id\n    username\n    name\n    email\n    profile\n    about\n    role\n    photo\n    createdAt\n    updatedAt\n    followingIds\n    followerIds\n  }\n}\n\nquery GetCatBlogs($getCatBlogsSlug: String!) {\n  getCatBlogs(slug: $getCatBlogsSlug) {\n    _id\n    createdAt\n    updatedAt\n    author {\n      username\n      name\n      profile\n    }\n    tags {\n      name\n      slug\n    }\n    categories {\n      name\n      slug\n    }\n    imageUri\n    mtitle\n    description\n    slug\n    title\n  }\n}\n\nquery GetTagBlogs($getTagBlogsSlug: String!) {\n  getTagBlogs(slug: $getTagBlogsSlug) {\n    _id\n    createdAt\n    updatedAt\n    author {\n      username\n      name\n      profile\n    }\n    tags {\n      name\n      slug\n    }\n    categories {\n      name\n      slug\n    }\n    imageUri\n    mtitle\n    description\n    slug\n    title\n  }\n}\n\nquery GetBlogBySlug($slug: String!) {\n  getBlogBySlug(slug: $slug) {\n    title\n    slug\n    description\n    body\n    mtitle\n    imageUri\n    active\n    likedBy {\n      username\n      name\n    }\n    comments {\n      content\n      by {\n        name\n        username\n      }\n      atBlog {\n        slug\n        title\n      }\n    }\n    _id\n    createdAt\n    updatedAt\n    author {\n      name\n      username\n    }\n    tags {\n      _id\n      slug\n      name\n    }\n    categories {\n      _id\n      slug\n      name\n    }\n  }\n}\n\nquery ListBlogsWithCatTag {\n  listBlogsWithCatTag {\n    title\n    description\n    body\n    slug\n    _id\n    mtitle\n    imageUri\n    active\n    createdAt\n    updatedAt\n    author {\n      name\n      profile\n    }\n    categories {\n      slug\n      name\n    }\n    tags {\n      slug\n      name\n    }\n  }\n}\n\nquery GetRelatedBlogs($limit: Float, $tagIds: [String!]!, $catIds: [String!]!, $getRelatedBlogsSlug: String!) {\n  getRelatedBlogs(\n    limit: $limit\n    tagIds: $tagIds\n    catIds: $catIds\n    slug: $getRelatedBlogsSlug\n  ) {\n    imageUri\n    _id\n    slug\n    tags {\n      slug\n      name\n    }\n  }\n}\n\nquery SearchBlogs($query: String!) {\n  searchBlogs(query: $query) {\n    slug\n    title\n    description\n    createdAt\n    imageUri\n    author {\n      name\n      photo\n    }\n    tags {\n      name\n      slug\n    }\n  }\n}\n\nquery GetUserBlogs($userId: String, $username: String) {\n  getUserBlogs(userId: $userId, username: $username) {\n    _id\n    author {\n      name\n      username\n    }\n    categories {\n      name\n      slug\n    }\n    tags {\n      slug\n      name\n    }\n    title\n    createdAt\n    description\n    imageUri\n    slug\n  }\n}\n\nquery ListTags {\n  listTags {\n    name\n    slug\n    _id\n  }\n}\n\nquery ListCats {\n  listCats {\n    name\n    _id\n    slug\n  }\n}\n\nquery GetBlogById($blogId: String!) {\n  getBlogById(blogId: $blogId) {\n    _id\n    active\n    author {\n      name\n    }\n    body\n    categories {\n      _id\n      name\n      slug\n    }\n    createdAt\n    description\n    imageUri\n    slug\n    tags {\n      name\n      slug\n      _id\n    }\n    title\n    updatedAt\n    mtitle\n  }\n}\n\nquery SearchUsers($name: String!) {\n  searchUsers(name: $name) {\n    username\n    name\n    email\n    profile\n    about\n    photo\n    followingIds\n    followerIds\n  }\n}\n\nquery GetUserInfo($username: String!) {\n  getUserInfo(username: $username) {\n    createdAt\n    email\n    name\n    photo\n    about\n    username\n  }\n}\n\nquery GetFollowInfo($username: String) {\n  getFollowInfo(username: $username) {\n    followers {\n      _id\n      username\n      name\n      email\n      profile\n      about\n      photo\n      followingIds\n      followerIds\n    }\n    followings {\n      _id\n      username\n      name\n      email\n      profile\n      about\n      photo\n      followingIds\n      followerIds\n    }\n  }\n}": types.CurrentUserDocument,
    "subscription BlogPublished($followingIds: [String!]!) {\n  blogPublished(followingIds: $followingIds) {\n    dateString\n    linkString\n    id\n    message\n  }\n}\n\nsubscription UserFollowed($name: String!) {\n  userFollowed(name: $name) {\n    dateString\n    linkString\n    id\n    message\n  }\n}": types.BlogPublishedDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation Register($registerPassword: String!, $registerEmail: String!, $registerName: String!) {\n  register(\n    password: $registerPassword\n    email: $registerEmail\n    name: $registerName\n  )\n}\n\nmutation Login($password: String!, $email: String!) {\n  login(password: $password, email: $email) {\n    accessToken\n    ok\n  }\n}\n\nmutation CreateBlog($blogInput: BlogInput!, $tagIds: [String!]) {\n  createBlog(blogInput: $blogInput, tagIds: $tagIds) {\n    success\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nmutation RefreshToken {\n  refreshToken {\n    ok\n    accessToken\n  }\n}\n\nmutation EditProfile($about: String, $name: String, $photo: String, $email: String) {\n  editProfile(about: $about, name: $name, photo: $photo, email: $email)\n}\n\nmutation ResetPassword($password: String!, $username: String!) {\n  resetPassword(password: $password, username: $username)\n}\n\nmutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}\n\nmutation DeleteTag($deleteTagId: String!) {\n  deleteTag(id: $deleteTagId)\n}\n\nmutation NewTag($tagName: String!) {\n  newTag(tagName: $tagName)\n}\n\nmutation NewCat($catName: String!) {\n  newCat(catName: $catName)\n}\n\nmutation DeleteCat($deleteCatId: String!) {\n  deleteCat(id: $deleteCatId)\n}\n\nmutation UpdateBlog($blogInput: BlogInput!, $blogId: String!, $tagIds: [String!]) {\n  updateBlog(blogInput: $blogInput, blogId: $blogId, tagIds: $tagIds) {\n    success\n  }\n}\n\nmutation DeleteBlogById($blogId: String!) {\n  deleteBlogById(blogId: $blogId)\n}\n\nmutation Follow($followName: String!) {\n  follow(followName: $followName)\n}\n\nmutation UnFollow($name: String!) {\n  unFollow(name: $name)\n}"): (typeof documents)["mutation Register($registerPassword: String!, $registerEmail: String!, $registerName: String!) {\n  register(\n    password: $registerPassword\n    email: $registerEmail\n    name: $registerName\n  )\n}\n\nmutation Login($password: String!, $email: String!) {\n  login(password: $password, email: $email) {\n    accessToken\n    ok\n  }\n}\n\nmutation CreateBlog($blogInput: BlogInput!, $tagIds: [String!]) {\n  createBlog(blogInput: $blogInput, tagIds: $tagIds) {\n    success\n  }\n}\n\nmutation Logout {\n  logout\n}\n\nmutation RefreshToken {\n  refreshToken {\n    ok\n    accessToken\n  }\n}\n\nmutation EditProfile($about: String, $name: String, $photo: String, $email: String) {\n  editProfile(about: $about, name: $name, photo: $photo, email: $email)\n}\n\nmutation ResetPassword($password: String!, $username: String!) {\n  resetPassword(password: $password, username: $username)\n}\n\nmutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email)\n}\n\nmutation DeleteTag($deleteTagId: String!) {\n  deleteTag(id: $deleteTagId)\n}\n\nmutation NewTag($tagName: String!) {\n  newTag(tagName: $tagName)\n}\n\nmutation NewCat($catName: String!) {\n  newCat(catName: $catName)\n}\n\nmutation DeleteCat($deleteCatId: String!) {\n  deleteCat(id: $deleteCatId)\n}\n\nmutation UpdateBlog($blogInput: BlogInput!, $blogId: String!, $tagIds: [String!]) {\n  updateBlog(blogInput: $blogInput, blogId: $blogId, tagIds: $tagIds) {\n    success\n  }\n}\n\nmutation DeleteBlogById($blogId: String!) {\n  deleteBlogById(blogId: $blogId)\n}\n\nmutation Follow($followName: String!) {\n  follow(followName: $followName)\n}\n\nmutation UnFollow($name: String!) {\n  unFollow(name: $name)\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query CurrentUser {\n  currentUser {\n    _id\n    username\n    name\n    email\n    profile\n    about\n    role\n    photo\n    createdAt\n    updatedAt\n    followingIds\n    followerIds\n  }\n}\n\nquery GetCatBlogs($getCatBlogsSlug: String!) {\n  getCatBlogs(slug: $getCatBlogsSlug) {\n    _id\n    createdAt\n    updatedAt\n    author {\n      username\n      name\n      profile\n    }\n    tags {\n      name\n      slug\n    }\n    categories {\n      name\n      slug\n    }\n    imageUri\n    mtitle\n    description\n    slug\n    title\n  }\n}\n\nquery GetTagBlogs($getTagBlogsSlug: String!) {\n  getTagBlogs(slug: $getTagBlogsSlug) {\n    _id\n    createdAt\n    updatedAt\n    author {\n      username\n      name\n      profile\n    }\n    tags {\n      name\n      slug\n    }\n    categories {\n      name\n      slug\n    }\n    imageUri\n    mtitle\n    description\n    slug\n    title\n  }\n}\n\nquery GetBlogBySlug($slug: String!) {\n  getBlogBySlug(slug: $slug) {\n    title\n    slug\n    description\n    body\n    mtitle\n    imageUri\n    active\n    likedBy {\n      username\n      name\n    }\n    comments {\n      content\n      by {\n        name\n        username\n      }\n      atBlog {\n        slug\n        title\n      }\n    }\n    _id\n    createdAt\n    updatedAt\n    author {\n      name\n      username\n    }\n    tags {\n      _id\n      slug\n      name\n    }\n    categories {\n      _id\n      slug\n      name\n    }\n  }\n}\n\nquery ListBlogsWithCatTag {\n  listBlogsWithCatTag {\n    title\n    description\n    body\n    slug\n    _id\n    mtitle\n    imageUri\n    active\n    createdAt\n    updatedAt\n    author {\n      name\n      profile\n    }\n    categories {\n      slug\n      name\n    }\n    tags {\n      slug\n      name\n    }\n  }\n}\n\nquery GetRelatedBlogs($limit: Float, $tagIds: [String!]!, $catIds: [String!]!, $getRelatedBlogsSlug: String!) {\n  getRelatedBlogs(\n    limit: $limit\n    tagIds: $tagIds\n    catIds: $catIds\n    slug: $getRelatedBlogsSlug\n  ) {\n    imageUri\n    _id\n    slug\n    tags {\n      slug\n      name\n    }\n  }\n}\n\nquery SearchBlogs($query: String!) {\n  searchBlogs(query: $query) {\n    slug\n    title\n    description\n    createdAt\n    imageUri\n    author {\n      name\n      photo\n    }\n    tags {\n      name\n      slug\n    }\n  }\n}\n\nquery GetUserBlogs($userId: String, $username: String) {\n  getUserBlogs(userId: $userId, username: $username) {\n    _id\n    author {\n      name\n      username\n    }\n    categories {\n      name\n      slug\n    }\n    tags {\n      slug\n      name\n    }\n    title\n    createdAt\n    description\n    imageUri\n    slug\n  }\n}\n\nquery ListTags {\n  listTags {\n    name\n    slug\n    _id\n  }\n}\n\nquery ListCats {\n  listCats {\n    name\n    _id\n    slug\n  }\n}\n\nquery GetBlogById($blogId: String!) {\n  getBlogById(blogId: $blogId) {\n    _id\n    active\n    author {\n      name\n    }\n    body\n    categories {\n      _id\n      name\n      slug\n    }\n    createdAt\n    description\n    imageUri\n    slug\n    tags {\n      name\n      slug\n      _id\n    }\n    title\n    updatedAt\n    mtitle\n  }\n}\n\nquery SearchUsers($name: String!) {\n  searchUsers(name: $name) {\n    username\n    name\n    email\n    profile\n    about\n    photo\n    followingIds\n    followerIds\n  }\n}\n\nquery GetUserInfo($username: String!) {\n  getUserInfo(username: $username) {\n    createdAt\n    email\n    name\n    photo\n    about\n    username\n  }\n}\n\nquery GetFollowInfo($username: String) {\n  getFollowInfo(username: $username) {\n    followers {\n      _id\n      username\n      name\n      email\n      profile\n      about\n      photo\n      followingIds\n      followerIds\n    }\n    followings {\n      _id\n      username\n      name\n      email\n      profile\n      about\n      photo\n      followingIds\n      followerIds\n    }\n  }\n}"): (typeof documents)["query CurrentUser {\n  currentUser {\n    _id\n    username\n    name\n    email\n    profile\n    about\n    role\n    photo\n    createdAt\n    updatedAt\n    followingIds\n    followerIds\n  }\n}\n\nquery GetCatBlogs($getCatBlogsSlug: String!) {\n  getCatBlogs(slug: $getCatBlogsSlug) {\n    _id\n    createdAt\n    updatedAt\n    author {\n      username\n      name\n      profile\n    }\n    tags {\n      name\n      slug\n    }\n    categories {\n      name\n      slug\n    }\n    imageUri\n    mtitle\n    description\n    slug\n    title\n  }\n}\n\nquery GetTagBlogs($getTagBlogsSlug: String!) {\n  getTagBlogs(slug: $getTagBlogsSlug) {\n    _id\n    createdAt\n    updatedAt\n    author {\n      username\n      name\n      profile\n    }\n    tags {\n      name\n      slug\n    }\n    categories {\n      name\n      slug\n    }\n    imageUri\n    mtitle\n    description\n    slug\n    title\n  }\n}\n\nquery GetBlogBySlug($slug: String!) {\n  getBlogBySlug(slug: $slug) {\n    title\n    slug\n    description\n    body\n    mtitle\n    imageUri\n    active\n    likedBy {\n      username\n      name\n    }\n    comments {\n      content\n      by {\n        name\n        username\n      }\n      atBlog {\n        slug\n        title\n      }\n    }\n    _id\n    createdAt\n    updatedAt\n    author {\n      name\n      username\n    }\n    tags {\n      _id\n      slug\n      name\n    }\n    categories {\n      _id\n      slug\n      name\n    }\n  }\n}\n\nquery ListBlogsWithCatTag {\n  listBlogsWithCatTag {\n    title\n    description\n    body\n    slug\n    _id\n    mtitle\n    imageUri\n    active\n    createdAt\n    updatedAt\n    author {\n      name\n      profile\n    }\n    categories {\n      slug\n      name\n    }\n    tags {\n      slug\n      name\n    }\n  }\n}\n\nquery GetRelatedBlogs($limit: Float, $tagIds: [String!]!, $catIds: [String!]!, $getRelatedBlogsSlug: String!) {\n  getRelatedBlogs(\n    limit: $limit\n    tagIds: $tagIds\n    catIds: $catIds\n    slug: $getRelatedBlogsSlug\n  ) {\n    imageUri\n    _id\n    slug\n    tags {\n      slug\n      name\n    }\n  }\n}\n\nquery SearchBlogs($query: String!) {\n  searchBlogs(query: $query) {\n    slug\n    title\n    description\n    createdAt\n    imageUri\n    author {\n      name\n      photo\n    }\n    tags {\n      name\n      slug\n    }\n  }\n}\n\nquery GetUserBlogs($userId: String, $username: String) {\n  getUserBlogs(userId: $userId, username: $username) {\n    _id\n    author {\n      name\n      username\n    }\n    categories {\n      name\n      slug\n    }\n    tags {\n      slug\n      name\n    }\n    title\n    createdAt\n    description\n    imageUri\n    slug\n  }\n}\n\nquery ListTags {\n  listTags {\n    name\n    slug\n    _id\n  }\n}\n\nquery ListCats {\n  listCats {\n    name\n    _id\n    slug\n  }\n}\n\nquery GetBlogById($blogId: String!) {\n  getBlogById(blogId: $blogId) {\n    _id\n    active\n    author {\n      name\n    }\n    body\n    categories {\n      _id\n      name\n      slug\n    }\n    createdAt\n    description\n    imageUri\n    slug\n    tags {\n      name\n      slug\n      _id\n    }\n    title\n    updatedAt\n    mtitle\n  }\n}\n\nquery SearchUsers($name: String!) {\n  searchUsers(name: $name) {\n    username\n    name\n    email\n    profile\n    about\n    photo\n    followingIds\n    followerIds\n  }\n}\n\nquery GetUserInfo($username: String!) {\n  getUserInfo(username: $username) {\n    createdAt\n    email\n    name\n    photo\n    about\n    username\n  }\n}\n\nquery GetFollowInfo($username: String) {\n  getFollowInfo(username: $username) {\n    followers {\n      _id\n      username\n      name\n      email\n      profile\n      about\n      photo\n      followingIds\n      followerIds\n    }\n    followings {\n      _id\n      username\n      name\n      email\n      profile\n      about\n      photo\n      followingIds\n      followerIds\n    }\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "subscription BlogPublished($followingIds: [String!]!) {\n  blogPublished(followingIds: $followingIds) {\n    dateString\n    linkString\n    id\n    message\n  }\n}\n\nsubscription UserFollowed($name: String!) {\n  userFollowed(name: $name) {\n    dateString\n    linkString\n    id\n    message\n  }\n}"): (typeof documents)["subscription BlogPublished($followingIds: [String!]!) {\n  blogPublished(followingIds: $followingIds) {\n    dateString\n    linkString\n    id\n    message\n  }\n}\n\nsubscription UserFollowed($name: String!) {\n  userFollowed(name: $name) {\n    dateString\n    linkString\n    id\n    message\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;