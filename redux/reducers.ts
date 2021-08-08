import { combineReducers } from 'redux'
import { LOAD_USER_PROFILE, LOAD_USER, LOGOUT_USER, ActionTypes } from './types'

const initialUser = {
    _id: '',
    username: '',
    name: '',
    email: '',
    role: '',
}

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
                role: payload.role,
            }

        case LOGOUT_USER:
            return { state: payload }

        default:
            return state
    }
}

const initialUserProfile = {
    user: {},
    blogs: [],
}

const userProfileReducer = (
    state = initialUserProfile,
    { type, payload }: { type: ActionTypes; payload: any }
) => {
    switch (type) {
        case LOAD_USER_PROFILE:
            return {
                ...state,
                user: payload.user,
                blogs: payload.blogs,
            }
        default:
            return state
    }
}

// COMBINED REDUCERS
const reducers = {
    user: userReducer,
    userProfile: userProfileReducer,
}

export default combineReducers(reducers)
