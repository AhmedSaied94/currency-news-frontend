import { createSlice } from "@reduxjs/toolkit"

const AuthedUSerSlice = createSlice({
    name: 'authedUser',
    initialState: {},
    reducers: {
      login(state, action) {
          state.authedUser = action.payload
      },
      like(state, action){
        state.authedUser.likes.push(action.payload.id)
      },
      unLike(state, action){
        state.authedUser.likes = state.authedUser.likes.filter(nid => nid!==action.payload.id)
      },
      handleWatchlist(state, action) {
        if (action.payload.oper === 'add'){
          state.authedUser.favorites.push(action.payload.id)
        }
        else if (action.payload.oper === 'remove'){
          state.authedUser.favorites = state.authedUser.favorites.filter(cur => cur !== action.payload.id)
        }
      },
    },
  })

  const {reducer, actions} = AuthedUSerSlice

  export const {login, logout, updateUser, handleWatchlist, like, unLike} = actions

  export const userReducer = reducer