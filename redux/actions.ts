import {
    LOAD_USER,
    LOAD_USER_PROFILE,
    LOGOUT_USER,
    LOAD_TAGS,
    LOAD_CATS,
    CLEAR_TAGS_CATS,
} from './types'
import { isAuth } from '../actions/auth'
import { userPublicProfile } from '../actions/user'
import { Dispatch } from 'redux'
import { listTags } from '../actions/tag'
import { listCategories } from '../actions/category'

export const loadUser = () => async (dispatch: Dispatch) => {
    const user = await isAuth()
    dispatch({
        type: LOAD_USER,
        payload: user,
    })
}

export const logoutUser = () => async (dispatch: Dispatch) => {
    dispatch({
        type: LOGOUT_USER,
        payload: null,
    })
}

export const clearTagCats = () => async (dispatch: Dispatch) => {
    dispatch({
        type: CLEAR_TAGS_CATS,
    })
}

export const loadTags = () => async (dispatch: Dispatch) => {
    const tags = await listTags()
    dispatch({
        type: LOAD_TAGS,
        payload: tags,
    })
}

export const loadCats = () => async (dispatch: Dispatch) => {
    const cats = await listCategories()
    dispatch({
        type: LOAD_CATS,
        payload: cats,
    })
}

export const loadUserProfile = () => async (dispatch: Dispatch) => {
    const username = await isAuth().username
    const userProfile = await userPublicProfile(username)
    dispatch({
        type: LOAD_USER_PROFILE,
        payload: { user: userProfile.user, blogs: userProfile.blogs },
    })
}
