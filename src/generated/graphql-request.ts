import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  ObjectId: { input: any; output: any; }
};

export type Blog = {
  __typename?: 'Blog';
  _id: Scalars['ObjectId']['output'];
  active?: Maybe<Scalars['Boolean']['output']>;
  author: User;
  body: Scalars['String']['output'];
  categories: Array<Category>;
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  imageUri?: Maybe<Scalars['String']['output']>;
  likedBy?: Maybe<Array<User>>;
  mtitle: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  tags: Array<Tag>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type BlogInput = {
  active: Scalars['Boolean']['input'];
  body: Scalars['String']['input'];
  imageUri?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type Category = {
  __typename?: 'Category';
  _id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['ObjectId']['output'];
  atBlog: Blog;
  by: User;
  content: Scalars['String']['output'];
};

export type Conversation = {
  __typename?: 'Conversation';
  _id: Scalars['ObjectId']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  latestMessage?: Maybe<Message>;
  latestMessageId?: Maybe<Scalars['String']['output']>;
  messages: Array<Message>;
  participantUserIds: Array<Scalars['String']['output']>;
  participants: Array<Participant>;
  updatedAt: Scalars['DateTime']['output'];
};

export type ConversationUpdated = {
  __typename?: 'ConversationUpdated';
  addedUserIds?: Maybe<Array<Scalars['String']['output']>>;
  conversation: PopulatedConversation;
  removedUserIds?: Maybe<Array<Scalars['String']['output']>>;
};

export type FollowInfo = {
  __typename?: 'FollowInfo';
  followers: Array<User>;
  followings: Array<User>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String']['output'];
  accessTokenExpiry: Scalars['Float']['output'];
  ok: Scalars['Boolean']['output'];
  refreshToken: Scalars['String']['output'];
};

export type Message = {
  __typename?: 'Message';
  _id: Scalars['ObjectId']['output'];
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  sender: User;
  senderId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBlog: NewBlogResponse;
  createConversation: Scalars['String']['output'];
  deleteBlogById: Scalars['Boolean']['output'];
  deleteCat: Scalars['Boolean']['output'];
  deleteConversation: Scalars['Boolean']['output'];
  deleteTag: Scalars['Boolean']['output'];
  editProfile: Scalars['Boolean']['output'];
  follow: Scalars['Boolean']['output'];
  forgotPassword: Scalars['String']['output'];
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  markConversationAsRead: Scalars['Boolean']['output'];
  newCat: Scalars['Boolean']['output'];
  newTag: Scalars['Boolean']['output'];
  refreshToken: LoginResponse;
  register: Scalars['String']['output'];
  resetPassword: Scalars['Boolean']['output'];
  revokeRefreshTokensForUser: Scalars['Boolean']['output'];
  sendMessage: Scalars['Boolean']['output'];
  unFollow: Scalars['Boolean']['output'];
  updateBlog: NewBlogResponse;
  updateParticipants: Scalars['Boolean']['output'];
};


export type MutationCreateBlogArgs = {
  blogInput: BlogInput;
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationCreateConversationArgs = {
  participantUserIds: Array<Scalars['String']['input']>;
};


export type MutationDeleteBlogByIdArgs = {
  blogId: Scalars['String']['input'];
};


export type MutationDeleteCatArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteConversationArgs = {
  conversationId: Scalars['String']['input'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['String']['input'];
};


export type MutationEditProfileArgs = {
  about?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
};


export type MutationFollowArgs = {
  followName: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationMarkConversationAsReadArgs = {
  conversationId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type MutationNewCatArgs = {
  catName: Scalars['String']['input'];
};


export type MutationNewTagArgs = {
  tagName: Scalars['String']['input'];
};


export type MutationRefreshTokenArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRevokeRefreshTokensForUserArgs = {
  userId: Scalars['String']['input'];
};


export type MutationSendMessageArgs = {
  body: Scalars['String']['input'];
  conversationId: Scalars['String']['input'];
  senderId: Scalars['String']['input'];
};


export type MutationUnFollowArgs = {
  name: Scalars['String']['input'];
};


export type MutationUpdateBlogArgs = {
  blogId: Scalars['String']['input'];
  blogInput: BlogInput;
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type MutationUpdateParticipantsArgs = {
  conversationId: Scalars['String']['input'];
  participantIds: Array<Scalars['String']['input']>;
};

export type NewBlogResponse = {
  __typename?: 'NewBlogResponse';
  blog?: Maybe<Blog>;
  success: Scalars['Boolean']['output'];
};

export type Notification = {
  __typename?: 'Notification';
  dateString: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  linkString: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Participant = {
  __typename?: 'Participant';
  _id: Scalars['ObjectId']['output'];
  conversation: Conversation;
  conversationId: Scalars['String']['output'];
  hasSeenLatestMessage: Scalars['Boolean']['output'];
  user: User;
  userId: Scalars['String']['output'];
};

export type PopulatedConversation = {
  __typename?: 'PopulatedConversation';
  _id: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  latestMessage?: Maybe<PopulatedMessage>;
  latestMessageId?: Maybe<Scalars['String']['output']>;
  messages: Array<PopulatedMessage>;
  participantUserIds: Array<Scalars['String']['output']>;
  participants: Array<PopulatedParticipant>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type PopulatedMessage = {
  __typename?: 'PopulatedMessage';
  _id: Scalars['String']['output'];
  body: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  sender: PopulatedUser;
  senderId: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PopulatedParticipant = {
  __typename?: 'PopulatedParticipant';
  _id: Scalars['String']['output'];
  hasSeenLatestMessage: Scalars['Boolean']['output'];
  user: PopulatedUser;
  userId: Scalars['String']['output'];
};

export type PopulatedUser = {
  __typename?: 'PopulatedUser';
  _id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  photo: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  conversations: Array<Conversation>;
  currentUser?: Maybe<User>;
  getBlogById: Blog;
  getBlogBySlug: Blog;
  getCatBlogs: Array<Blog>;
  getFollowInfo?: Maybe<FollowInfo>;
  getRelatedBlogs: Array<Blog>;
  getTagBlogs: Array<Blog>;
  getUserBlogs: Array<Blog>;
  getUserInfo: UserInfoResponse;
  listBlogsWithCatTag: Array<Blog>;
  listCats: Array<Category>;
  listTags: Array<Tag>;
  messages: Array<Message>;
  searchBlogs: Array<Blog>;
  searchUsers?: Maybe<Array<User>>;
};


export type QueryGetBlogByIdArgs = {
  blogId: Scalars['String']['input'];
};


export type QueryGetBlogBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetCatBlogsArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetFollowInfoArgs = {
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetRelatedBlogsArgs = {
  catIds: Array<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  slug: Scalars['String']['input'];
  tagIds: Array<Scalars['String']['input']>;
};


export type QueryGetTagBlogsArgs = {
  slug: Scalars['String']['input'];
};


export type QueryGetUserBlogsArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGetUserInfoArgs = {
  username: Scalars['String']['input'];
};


export type QueryMessagesArgs = {
  conversationId: Scalars['String']['input'];
};


export type QuerySearchBlogsArgs = {
  query: Scalars['String']['input'];
};


export type QuerySearchUsersArgs = {
  name: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  blogPublished: Notification;
  conversationCreated: PopulatedConversation;
  conversationDeleted: PopulatedConversation;
  conversationUpdated: ConversationUpdated;
  messageSent: Message;
  userFollowed: Notification;
};


export type SubscriptionBlogPublishedArgs = {
  followingIds: Array<Scalars['String']['input']>;
};


export type SubscriptionUserFollowedArgs = {
  name: Scalars['String']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  _id: Scalars['ObjectId']['output'];
  name: Scalars['String']['output'];
  slug: Scalars['String']['output'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ObjectId']['output'];
  about?: Maybe<Scalars['String']['output']>;
  commented: Array<Comment>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  followerIds: Array<Scalars['String']['output']>;
  followers: Array<User>;
  followingIds: Array<Scalars['String']['output']>;
  followings: Array<User>;
  name: Scalars['String']['output'];
  photo?: Maybe<Scalars['String']['output']>;
  profile: Scalars['String']['output'];
  resetPasswordLink?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
  username: Scalars['String']['output'];
};

export type UserInfoResponse = {
  __typename?: 'UserInfoResponse';
  _id: Scalars['String']['output'];
  about: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  photo: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type RegisterMutationVariables = Exact<{
  registerPassword: Scalars['String']['input'];
  registerEmail: Scalars['String']['input'];
  registerName: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: string };

export type LoginMutationVariables = Exact<{
  password: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', accessToken: string, refreshToken: string, accessTokenExpiry: number, ok: boolean } };

export type CreateBlogMutationVariables = Exact<{
  blogInput: BlogInput;
  tagIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type CreateBlogMutation = { __typename?: 'Mutation', createBlog: { __typename?: 'NewBlogResponse', success: boolean, blog?: { __typename?: 'Blog', _id: any, title: string, body: string, slug: string, description?: string | null, author: { __typename?: 'User', name: string }, tags: Array<{ __typename?: 'Tag', _id: any }> } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { __typename?: 'Mutation', refreshToken: { __typename?: 'LoginResponse', accessToken: string, accessTokenExpiry: number, refreshToken: string, ok: boolean } };

export type EditProfileMutationVariables = Exact<{
  about?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  photo?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
}>;


export type EditProfileMutation = { __typename?: 'Mutation', editProfile: boolean };

export type ResetPasswordMutationVariables = Exact<{
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: string };

export type DeleteTagMutationVariables = Exact<{
  deleteTagId: Scalars['String']['input'];
}>;


export type DeleteTagMutation = { __typename?: 'Mutation', deleteTag: boolean };

export type NewTagMutationVariables = Exact<{
  tagName: Scalars['String']['input'];
}>;


export type NewTagMutation = { __typename?: 'Mutation', newTag: boolean };

export type NewCatMutationVariables = Exact<{
  catName: Scalars['String']['input'];
}>;


export type NewCatMutation = { __typename?: 'Mutation', newCat: boolean };

export type DeleteCatMutationVariables = Exact<{
  deleteCatId: Scalars['String']['input'];
}>;


export type DeleteCatMutation = { __typename?: 'Mutation', deleteCat: boolean };

export type UpdateBlogMutationVariables = Exact<{
  blogInput: BlogInput;
  blogId: Scalars['String']['input'];
  tagIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type UpdateBlogMutation = { __typename?: 'Mutation', updateBlog: { __typename?: 'NewBlogResponse', success: boolean } };

export type DeleteBlogByIdMutationVariables = Exact<{
  blogId: Scalars['String']['input'];
}>;


export type DeleteBlogByIdMutation = { __typename?: 'Mutation', deleteBlogById: boolean };

export type FollowMutationVariables = Exact<{
  followName: Scalars['String']['input'];
}>;


export type FollowMutation = { __typename?: 'Mutation', follow: boolean };

export type UnFollowMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type UnFollowMutation = { __typename?: 'Mutation', unFollow: boolean };

export type CreateConversationMutationVariables = Exact<{
  participantUserIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type CreateConversationMutation = { __typename?: 'Mutation', createConversation: string };

export type DeleteConversationMutationVariables = Exact<{
  conversationId: Scalars['String']['input'];
}>;


export type DeleteConversationMutation = { __typename?: 'Mutation', deleteConversation: boolean };

export type UpdateParticipantsMutationVariables = Exact<{
  participantIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  conversationId: Scalars['String']['input'];
}>;


export type UpdateParticipantsMutation = { __typename?: 'Mutation', updateParticipants: boolean };

export type SendMessageMutationVariables = Exact<{
  conversationId: Scalars['String']['input'];
  senderId: Scalars['String']['input'];
  body: Scalars['String']['input'];
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: boolean };

export type MarkConversationAsReadMutationVariables = Exact<{
  conversationId: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type MarkConversationAsReadMutation = { __typename?: 'Mutation', markConversationAsRead: boolean };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', _id: any, username: string, name: string, email: string, profile: string, about?: string | null, role: string, photo?: string | null, createdAt: string, updatedAt?: string | null, followingIds: Array<string>, followerIds: Array<string> } | null };

export type GetCatBlogsQueryVariables = Exact<{
  getCatBlogsSlug: Scalars['String']['input'];
}>;


export type GetCatBlogsQuery = { __typename?: 'Query', getCatBlogs: Array<{ __typename?: 'Blog', _id: any, createdAt: string, updatedAt: string, imageUri?: string | null, mtitle: string, description?: string | null, slug: string, title: string, author: { __typename?: 'User', username: string, name: string, profile: string }, tags: Array<{ __typename?: 'Tag', name: string, slug: string }>, categories: Array<{ __typename?: 'Category', name: string, slug: string }> }> };

export type GetTagBlogsQueryVariables = Exact<{
  getTagBlogsSlug: Scalars['String']['input'];
}>;


export type GetTagBlogsQuery = { __typename?: 'Query', getTagBlogs: Array<{ __typename?: 'Blog', _id: any, createdAt: string, updatedAt: string, imageUri?: string | null, mtitle: string, description?: string | null, slug: string, title: string, author: { __typename?: 'User', username: string, name: string, profile: string }, tags: Array<{ __typename?: 'Tag', name: string, slug: string }>, categories: Array<{ __typename?: 'Category', name: string, slug: string }> }> };

export type GetBlogBySlugQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type GetBlogBySlugQuery = { __typename?: 'Query', getBlogBySlug: { __typename?: 'Blog', title: string, slug: string, description?: string | null, body: string, mtitle: string, imageUri?: string | null, active?: boolean | null, _id: any, createdAt: string, updatedAt: string, likedBy?: Array<{ __typename?: 'User', username: string, name: string }> | null, comments?: Array<{ __typename?: 'Comment', content: string, by: { __typename?: 'User', name: string, username: string }, atBlog: { __typename?: 'Blog', slug: string, title: string } }> | null, author: { __typename?: 'User', name: string, username: string }, tags: Array<{ __typename?: 'Tag', _id: any, slug: string, name: string }>, categories: Array<{ __typename?: 'Category', _id: any, slug: string, name: string }> } };

export type ListBlogsWithCatTagQueryVariables = Exact<{ [key: string]: never; }>;


export type ListBlogsWithCatTagQuery = { __typename?: 'Query', listBlogsWithCatTag: Array<{ __typename?: 'Blog', title: string, description?: string | null, body: string, slug: string, _id: any, mtitle: string, imageUri?: string | null, active?: boolean | null, createdAt: string, updatedAt: string, author: { __typename?: 'User', name: string, profile: string }, categories: Array<{ __typename?: 'Category', slug: string, name: string }>, tags: Array<{ __typename?: 'Tag', slug: string, name: string }> }> };

export type GetRelatedBlogsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Float']['input']>;
  tagIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  catIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  getRelatedBlogsSlug: Scalars['String']['input'];
}>;


export type GetRelatedBlogsQuery = { __typename?: 'Query', getRelatedBlogs: Array<{ __typename?: 'Blog', imageUri?: string | null, _id: any, slug: string, tags: Array<{ __typename?: 'Tag', slug: string, name: string }> }> };

export type SearchBlogsQueryVariables = Exact<{
  query: Scalars['String']['input'];
}>;


export type SearchBlogsQuery = { __typename?: 'Query', searchBlogs: Array<{ __typename?: 'Blog', slug: string, title: string, description?: string | null, createdAt: string, imageUri?: string | null, author: { __typename?: 'User', name: string, photo?: string | null }, tags: Array<{ __typename?: 'Tag', name: string, slug: string }> }> };

export type GetUserBlogsQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUserBlogsQuery = { __typename?: 'Query', getUserBlogs: Array<{ __typename?: 'Blog', _id: any, title: string, createdAt: string, description?: string | null, imageUri?: string | null, slug: string, author: { __typename?: 'User', name: string, username: string }, categories: Array<{ __typename?: 'Category', name: string, slug: string }>, tags: Array<{ __typename?: 'Tag', slug: string, name: string }> }> };

export type ListTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListTagsQuery = { __typename?: 'Query', listTags: Array<{ __typename?: 'Tag', name: string, slug: string, _id: any }> };

export type ListCatsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListCatsQuery = { __typename?: 'Query', listCats: Array<{ __typename?: 'Category', name: string, _id: any, slug: string }> };

export type GetBlogByIdQueryVariables = Exact<{
  blogId: Scalars['String']['input'];
}>;


export type GetBlogByIdQuery = { __typename?: 'Query', getBlogById: { __typename?: 'Blog', _id: any, active?: boolean | null, body: string, createdAt: string, description?: string | null, imageUri?: string | null, slug: string, title: string, updatedAt: string, mtitle: string, author: { __typename?: 'User', name: string }, categories: Array<{ __typename?: 'Category', _id: any, name: string, slug: string }>, tags: Array<{ __typename?: 'Tag', name: string, slug: string, _id: any }> } };

export type SearchUsersQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers?: Array<{ __typename?: 'User', _id: any, username: string, name: string, email: string, profile: string, about?: string | null, photo?: string | null, followingIds: Array<string>, followerIds: Array<string> }> | null };

export type GetUserInfoQueryVariables = Exact<{
  username: Scalars['String']['input'];
}>;


export type GetUserInfoQuery = { __typename?: 'Query', getUserInfo: { __typename?: 'UserInfoResponse', _id: string, createdAt: string, email: string, name: string, photo: string, about: string, username: string } };

export type GetFollowInfoQueryVariables = Exact<{
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetFollowInfoQuery = { __typename?: 'Query', getFollowInfo?: { __typename?: 'FollowInfo', followers: Array<{ __typename?: 'User', _id: any, username: string, name: string, email: string, profile: string, about?: string | null, photo?: string | null, followingIds: Array<string>, followerIds: Array<string> }>, followings: Array<{ __typename?: 'User', _id: any, username: string, name: string, email: string, profile: string, about?: string | null, photo?: string | null, followingIds: Array<string>, followerIds: Array<string> }> } | null };

export type ConversationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ConversationsQuery = { __typename?: 'Query', conversations: Array<{ __typename?: 'Conversation', createdAt?: string | null, updatedAt: string, _id: any, latestMessage?: { __typename?: 'Message', _id: any, senderId: string, createdAt: string, updatedAt: string, body: string, sender: { __typename?: 'User', _id: any, name: string, username: string } } | null, messages: Array<{ __typename?: 'Message', _id: any, senderId: string, body: string, createdAt: string, updatedAt: string, sender: { __typename?: 'User', _id: any, name: string, username: string, photo?: string | null } }>, participants: Array<{ __typename?: 'Participant', _id: any, conversationId: string, userId: string, hasSeenLatestMessage: boolean, user: { __typename?: 'User', _id: any, name: string, username: string, photo?: string | null } }> }> };

export type MessagesQueryVariables = Exact<{
  conversationId: Scalars['String']['input'];
}>;


export type MessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', body: string, createdAt: string, senderId: string, _id: any, sender: { __typename?: 'User', _id: any, name: string, photo?: string | null, username: string } }> };

export type BlogPublishedSubscriptionVariables = Exact<{
  followingIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type BlogPublishedSubscription = { __typename?: 'Subscription', blogPublished: { __typename?: 'Notification', dateString: string, linkString: string, id: string, message: string } };

export type UserFollowedSubscriptionVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type UserFollowedSubscription = { __typename?: 'Subscription', userFollowed: { __typename?: 'Notification', dateString: string, linkString: string, id: string, message: string } };

export type ConversationCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ConversationCreatedSubscription = { __typename?: 'Subscription', conversationCreated: { __typename?: 'PopulatedConversation', _id: string, createdAt: string, participantUserIds: Array<string>, latestMessageId?: string | null, updatedAt?: string | null, latestMessage?: { __typename?: 'PopulatedMessage', body: string, senderId: string } | null, messages: Array<{ __typename?: 'PopulatedMessage', _id: string, body: string, senderId: string, createdAt: string, updatedAt: string, sender: { __typename?: 'PopulatedUser', name: string, username: string, _id: string, photo: string } }>, participants: Array<{ __typename?: 'PopulatedParticipant', _id: string, hasSeenLatestMessage: boolean, userId: string }> } };

export type ConversationDeletedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ConversationDeletedSubscription = { __typename?: 'Subscription', conversationDeleted: { __typename?: 'PopulatedConversation', participantUserIds: Array<string>, latestMessageId?: string | null, _id: string, createdAt: string, updatedAt?: string | null, participants: Array<{ __typename?: 'PopulatedParticipant', _id: string, hasSeenLatestMessage: boolean, userId: string }> } };

export type ConversationUpdatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type ConversationUpdatedSubscription = { __typename?: 'Subscription', conversationUpdated: { __typename?: 'ConversationUpdated', addedUserIds?: Array<string> | null, removedUserIds?: Array<string> | null, conversation: { __typename?: 'PopulatedConversation', participantUserIds: Array<string>, latestMessageId?: string | null, _id: string, updatedAt?: string | null, createdAt: string, participants: Array<{ __typename?: 'PopulatedParticipant', hasSeenLatestMessage: boolean, _id: string }>, latestMessage?: { __typename?: 'PopulatedMessage', _id: string, body: string, senderId: string, createdAt: string, sender: { __typename?: 'PopulatedUser', _id: string, name: string, photo: string, username: string } } | null } } };

export type MessageSentSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type MessageSentSubscription = { __typename?: 'Subscription', messageSent: { __typename?: 'Message', body: string, createdAt: string, senderId: string, updatedAt: string, _id: any, sender: { __typename?: 'User', _id: any, name: string, username: string, photo?: string | null } } };


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
    refreshToken
    accessTokenExpiry
    ok
  }
}
    `;
export const CreateBlogDocument = gql`
    mutation CreateBlog($blogInput: BlogInput!, $tagIds: [String!]) {
  createBlog(blogInput: $blogInput, tagIds: $tagIds) {
    success
    blog {
      _id
      title
      body
      slug
      description
      author {
        name
      }
      tags {
        _id
      }
    }
  }
}
    `;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export const RefreshTokenDocument = gql`
    mutation RefreshToken($refreshToken: String!) {
  refreshToken(refreshToken: $refreshToken) {
    accessToken
    accessTokenExpiry
    refreshToken
    ok
  }
}
    `;
export const EditProfileDocument = gql`
    mutation EditProfile($about: String, $name: String, $photo: String, $email: String) {
  editProfile(about: $about, name: $name, photo: $photo, email: $email)
}
    `;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($password: String!, $username: String!) {
  resetPassword(password: $password, username: $username)
}
    `;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export const DeleteTagDocument = gql`
    mutation DeleteTag($deleteTagId: String!) {
  deleteTag(id: $deleteTagId)
}
    `;
export const NewTagDocument = gql`
    mutation NewTag($tagName: String!) {
  newTag(tagName: $tagName)
}
    `;
export const NewCatDocument = gql`
    mutation NewCat($catName: String!) {
  newCat(catName: $catName)
}
    `;
export const DeleteCatDocument = gql`
    mutation DeleteCat($deleteCatId: String!) {
  deleteCat(id: $deleteCatId)
}
    `;
export const UpdateBlogDocument = gql`
    mutation UpdateBlog($blogInput: BlogInput!, $blogId: String!, $tagIds: [String!]) {
  updateBlog(blogInput: $blogInput, blogId: $blogId, tagIds: $tagIds) {
    success
  }
}
    `;
export const DeleteBlogByIdDocument = gql`
    mutation DeleteBlogById($blogId: String!) {
  deleteBlogById(blogId: $blogId)
}
    `;
export const FollowDocument = gql`
    mutation Follow($followName: String!) {
  follow(followName: $followName)
}
    `;
export const UnFollowDocument = gql`
    mutation UnFollow($name: String!) {
  unFollow(name: $name)
}
    `;
export const CreateConversationDocument = gql`
    mutation CreateConversation($participantUserIds: [String!]!) {
  createConversation(participantUserIds: $participantUserIds)
}
    `;
export const DeleteConversationDocument = gql`
    mutation DeleteConversation($conversationId: String!) {
  deleteConversation(conversationId: $conversationId)
}
    `;
export const UpdateParticipantsDocument = gql`
    mutation UpdateParticipants($participantIds: [String!]!, $conversationId: String!) {
  updateParticipants(
    participantIds: $participantIds
    conversationId: $conversationId
  )
}
    `;
export const SendMessageDocument = gql`
    mutation SendMessage($conversationId: String!, $senderId: String!, $body: String!) {
  sendMessage(conversationId: $conversationId, senderId: $senderId, body: $body)
}
    `;
export const MarkConversationAsReadDocument = gql`
    mutation MarkConversationAsRead($conversationId: String!, $userId: String!) {
  markConversationAsRead(conversationId: $conversationId, userId: $userId)
}
    `;
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
    followingIds
    followerIds
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
    `;
export const GetBlogBySlugDocument = gql`
    query GetBlogBySlug($slug: String!) {
  getBlogBySlug(slug: $slug) {
    title
    slug
    description
    body
    mtitle
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
export const SearchBlogsDocument = gql`
    query SearchBlogs($query: String!) {
  searchBlogs(query: $query) {
    slug
    title
    description
    createdAt
    imageUri
    author {
      name
      photo
    }
    tags {
      name
      slug
    }
  }
}
    `;
export const GetUserBlogsDocument = gql`
    query GetUserBlogs($userId: String, $username: String) {
  getUserBlogs(userId: $userId, username: $username) {
    _id
    author {
      name
      username
    }
    categories {
      name
      slug
    }
    tags {
      slug
      name
    }
    title
    createdAt
    description
    imageUri
    slug
  }
}
    `;
export const ListTagsDocument = gql`
    query ListTags {
  listTags {
    name
    slug
    _id
  }
}
    `;
export const ListCatsDocument = gql`
    query ListCats {
  listCats {
    name
    _id
    slug
  }
}
    `;
export const GetBlogByIdDocument = gql`
    query GetBlogById($blogId: String!) {
  getBlogById(blogId: $blogId) {
    _id
    active
    author {
      name
    }
    body
    categories {
      _id
      name
      slug
    }
    createdAt
    description
    imageUri
    slug
    tags {
      name
      slug
      _id
    }
    title
    updatedAt
    mtitle
  }
}
    `;
export const SearchUsersDocument = gql`
    query SearchUsers($name: String!) {
  searchUsers(name: $name) {
    _id
    username
    name
    email
    profile
    about
    photo
    followingIds
    followerIds
  }
}
    `;
export const GetUserInfoDocument = gql`
    query GetUserInfo($username: String!) {
  getUserInfo(username: $username) {
    _id
    createdAt
    email
    name
    photo
    about
    username
  }
}
    `;
export const GetFollowInfoDocument = gql`
    query GetFollowInfo($username: String) {
  getFollowInfo(username: $username) {
    followers {
      _id
      username
      name
      email
      profile
      about
      photo
      followingIds
      followerIds
    }
    followings {
      _id
      username
      name
      email
      profile
      about
      photo
      followingIds
      followerIds
    }
  }
}
    `;
export const ConversationsDocument = gql`
    query Conversations {
  conversations {
    latestMessage {
      _id
      senderId
      createdAt
      updatedAt
      sender {
        _id
        name
        username
      }
      body
    }
    createdAt
    updatedAt
    _id
    messages {
      _id
      senderId
      body
      sender {
        _id
        name
        username
        photo
      }
      createdAt
      updatedAt
    }
    participants {
      _id
      user {
        _id
        name
        username
        photo
      }
      conversationId
      userId
      hasSeenLatestMessage
    }
  }
}
    `;
export const MessagesDocument = gql`
    query Messages($conversationId: String!) {
  messages(conversationId: $conversationId) {
    body
    createdAt
    sender {
      _id
      name
      photo
      username
    }
    senderId
    _id
  }
}
    `;
export const BlogPublishedDocument = gql`
    subscription BlogPublished($followingIds: [String!]!) {
  blogPublished(followingIds: $followingIds) {
    dateString
    linkString
    id
    message
  }
}
    `;
export const UserFollowedDocument = gql`
    subscription UserFollowed($name: String!) {
  userFollowed(name: $name) {
    dateString
    linkString
    id
    message
  }
}
    `;
export const ConversationCreatedDocument = gql`
    subscription ConversationCreated {
  conversationCreated {
    _id
    createdAt
    latestMessage {
      body
      senderId
    }
    messages {
      _id
      body
      senderId
      sender {
        name
        username
        _id
        photo
      }
      createdAt
      updatedAt
    }
    participantUserIds
    participants {
      _id
      hasSeenLatestMessage
      userId
    }
    latestMessageId
    createdAt
    updatedAt
  }
}
    `;
export const ConversationDeletedDocument = gql`
    subscription ConversationDeleted {
  conversationDeleted {
    participantUserIds
    participants {
      _id
      hasSeenLatestMessage
      userId
    }
    latestMessageId
    _id
    createdAt
    updatedAt
  }
}
    `;
export const ConversationUpdatedDocument = gql`
    subscription ConversationUpdated {
  conversationUpdated {
    addedUserIds
    removedUserIds
    conversation {
      participantUserIds
      participants {
        hasSeenLatestMessage
        _id
      }
      latestMessageId
      latestMessage {
        _id
        body
        senderId
        createdAt
        sender {
          _id
          name
          photo
          username
        }
      }
      _id
      updatedAt
      createdAt
    }
  }
}
    `;
export const MessageSentDocument = gql`
    subscription MessageSent {
  messageSent {
    body
    createdAt
    sender {
      _id
      name
      username
      photo
    }
    senderId
    updatedAt
    _id
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Register(variables: RegisterMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RegisterMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterMutation>(RegisterDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Register', 'mutation');
    },
    Login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>(LoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Login', 'mutation');
    },
    CreateBlog(variables: CreateBlogMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateBlogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateBlogMutation>(CreateBlogDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateBlog', 'mutation');
    },
    Logout(variables?: LogoutMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<LogoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LogoutMutation>(LogoutDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Logout', 'mutation');
    },
    RefreshToken(variables: RefreshTokenMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<RefreshTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RefreshTokenMutation>(RefreshTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RefreshToken', 'mutation');
    },
    EditProfile(variables?: EditProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<EditProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditProfileMutation>(EditProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditProfile', 'mutation');
    },
    ResetPassword(variables: ResetPasswordMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ResetPasswordMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResetPasswordMutation>(ResetPasswordDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ResetPassword', 'mutation');
    },
    ForgotPassword(variables: ForgotPasswordMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ForgotPasswordMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ForgotPasswordMutation>(ForgotPasswordDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ForgotPassword', 'mutation');
    },
    DeleteTag(variables: DeleteTagMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteTagMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteTagMutation>(DeleteTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteTag', 'mutation');
    },
    NewTag(variables: NewTagMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<NewTagMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<NewTagMutation>(NewTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'NewTag', 'mutation');
    },
    NewCat(variables: NewCatMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<NewCatMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<NewCatMutation>(NewCatDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'NewCat', 'mutation');
    },
    DeleteCat(variables: DeleteCatMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteCatMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCatMutation>(DeleteCatDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteCat', 'mutation');
    },
    UpdateBlog(variables: UpdateBlogMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateBlogMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBlogMutation>(UpdateBlogDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateBlog', 'mutation');
    },
    DeleteBlogById(variables: DeleteBlogByIdMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteBlogByIdMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteBlogByIdMutation>(DeleteBlogByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteBlogById', 'mutation');
    },
    Follow(variables: FollowMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<FollowMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FollowMutation>(FollowDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Follow', 'mutation');
    },
    UnFollow(variables: UnFollowMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UnFollowMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnFollowMutation>(UnFollowDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UnFollow', 'mutation');
    },
    CreateConversation(variables: CreateConversationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CreateConversationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateConversationMutation>(CreateConversationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateConversation', 'mutation');
    },
    DeleteConversation(variables: DeleteConversationMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<DeleteConversationMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteConversationMutation>(DeleteConversationDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'DeleteConversation', 'mutation');
    },
    UpdateParticipants(variables: UpdateParticipantsMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UpdateParticipantsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateParticipantsMutation>(UpdateParticipantsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UpdateParticipants', 'mutation');
    },
    SendMessage(variables: SendMessageMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SendMessageMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendMessageMutation>(SendMessageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SendMessage', 'mutation');
    },
    MarkConversationAsRead(variables: MarkConversationAsReadMutationVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MarkConversationAsReadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarkConversationAsReadMutation>(MarkConversationAsReadDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MarkConversationAsRead', 'mutation');
    },
    CurrentUser(variables?: CurrentUserQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<CurrentUserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CurrentUserQuery>(CurrentUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CurrentUser', 'query');
    },
    GetCatBlogs(variables: GetCatBlogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetCatBlogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCatBlogsQuery>(GetCatBlogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetCatBlogs', 'query');
    },
    GetTagBlogs(variables: GetTagBlogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetTagBlogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTagBlogsQuery>(GetTagBlogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTagBlogs', 'query');
    },
    GetBlogBySlug(variables: GetBlogBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetBlogBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBlogBySlugQuery>(GetBlogBySlugDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetBlogBySlug', 'query');
    },
    ListBlogsWithCatTag(variables?: ListBlogsWithCatTagQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ListBlogsWithCatTagQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListBlogsWithCatTagQuery>(ListBlogsWithCatTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ListBlogsWithCatTag', 'query');
    },
    GetRelatedBlogs(variables: GetRelatedBlogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetRelatedBlogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRelatedBlogsQuery>(GetRelatedBlogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetRelatedBlogs', 'query');
    },
    SearchBlogs(variables: SearchBlogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SearchBlogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchBlogsQuery>(SearchBlogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchBlogs', 'query');
    },
    GetUserBlogs(variables?: GetUserBlogsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserBlogsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserBlogsQuery>(GetUserBlogsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUserBlogs', 'query');
    },
    ListTags(variables?: ListTagsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ListTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListTagsQuery>(ListTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ListTags', 'query');
    },
    ListCats(variables?: ListCatsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ListCatsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListCatsQuery>(ListCatsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ListCats', 'query');
    },
    GetBlogById(variables: GetBlogByIdQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetBlogByIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetBlogByIdQuery>(GetBlogByIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetBlogById', 'query');
    },
    SearchUsers(variables: SearchUsersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<SearchUsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchUsersQuery>(SearchUsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchUsers', 'query');
    },
    GetUserInfo(variables: GetUserInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetUserInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetUserInfoQuery>(GetUserInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetUserInfo', 'query');
    },
    GetFollowInfo(variables?: GetFollowInfoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<GetFollowInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFollowInfoQuery>(GetFollowInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetFollowInfo', 'query');
    },
    Conversations(variables?: ConversationsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ConversationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConversationsQuery>(ConversationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Conversations', 'query');
    },
    Messages(variables: MessagesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MessagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MessagesQuery>(MessagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Messages', 'query');
    },
    BlogPublished(variables: BlogPublishedSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<BlogPublishedSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<BlogPublishedSubscription>(BlogPublishedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'BlogPublished', 'subscription');
    },
    UserFollowed(variables: UserFollowedSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<UserFollowedSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserFollowedSubscription>(UserFollowedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UserFollowed', 'subscription');
    },
    ConversationCreated(variables?: ConversationCreatedSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ConversationCreatedSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConversationCreatedSubscription>(ConversationCreatedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ConversationCreated', 'subscription');
    },
    ConversationDeleted(variables?: ConversationDeletedSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ConversationDeletedSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConversationDeletedSubscription>(ConversationDeletedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ConversationDeleted', 'subscription');
    },
    ConversationUpdated(variables?: ConversationUpdatedSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<ConversationUpdatedSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConversationUpdatedSubscription>(ConversationUpdatedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ConversationUpdated', 'subscription');
    },
    MessageSent(variables?: MessageSentSubscriptionVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<MessageSentSubscription> {
      return withWrapper((wrappedRequestHeaders) => client.request<MessageSentSubscription>(MessageSentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MessageSent', 'subscription');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;