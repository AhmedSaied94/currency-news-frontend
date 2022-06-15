import { createSlice } from "@reduxjs/toolkit";


const NewsSlice = createSlice({
    name:'news',
    initialState:{},
    reducers:{
        setNews(state, action){
            state.news = action.payload.news
        },
        createComment(state, action){
            state.news.comments.push(action.payload.comment)
        },
        deleteComment(state, action){
            state.news.comments = state.news.comments.filter(c => c.id !== action.payload.id)
        },
        newsLike(state, action){
            state.news.likes += 1
        },
        newsUnlike(state, action){
            state.news.likes -= 1
        }
        
    }
})

export const {setNews, deleteComment, createComment, newsLike, newsUnlike} = NewsSlice.actions
export const newsReducer = NewsSlice.reducer