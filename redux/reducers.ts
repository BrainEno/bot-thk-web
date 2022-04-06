import { DefaultRootState } from 'react-redux';
import { combineReducers } from 'redux';

import { IBlog, ICategory, ITag, IUser } from '../types';

import {
  ActionTypes,
  LOAD_USER,
  LOAD_USER_PROFILE,
  LOGOUT_USER
} from './types';

export interface RootState extends DefaultRootState {
  user: IUser;
  userProfile: { user: IUser; blogs: IBlog[] };
  tagsCats: { tags: ITag[]; cats: ICategory[] };
}

const initialUser = {
  _id: '',
  username: '',
  name: '',
  email: '',
  role: ''
};

const userReducer = (
  state = initialUser,
  { type, payload }: { type: ActionTypes; payload: any }
) => {
  switch (type) {
    case LOAD_USER:
      return {
        ...state,
        _id: payload._id,
        username: payload.username,
        name: payload.name,
        email: payload.email,
        role: payload.role
      };

    case LOGOUT_USER:
      return { state: payload };

    default:
      return state;
  }
};

const initialUserProfile = {
  user: {},
  blogs: []
};

const userProfileReducer = (
  state = initialUserProfile,
  { type, payload }: { type: ActionTypes; payload: any }
) => {
  switch (type) {
    case LOAD_USER_PROFILE:
      return {
        ...state,
        user: payload.user,
        blogs: payload.blogs
      };
    default:
      return state;
  }
};

type TagsCatsState = {
  tags: ITag[];
  cats: ICategory[];
};

const initialTagsCats: TagsCatsState = {
  tags: [],
  cats: []
};

const tagsCatsReducer = (
  state = initialTagsCats,
  { type, payload }: { type: ActionTypes; payload: any }
) => {
  switch (type) {
    case 'LOAD_TAGS':
      return {
        ...state,
        tags: payload
      };
    case 'LOAD_CATS':
      return {
        ...state,
        cats: payload
      };
    case 'CLEAR_TAGS_CATS':
    default:
      return state;
  }
};

// COMBINED REDUCERS
const reducers = {
  user: userReducer,
  userProfile: userProfileReducer,
  tagsCats: tagsCatsReducer
};

export default combineReducers(reducers);
