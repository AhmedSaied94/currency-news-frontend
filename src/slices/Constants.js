import { createSlice } from "@reduxjs/toolkit";

const constants = createSlice({
    name:'constants',
    initialState:{},
    reducers:{
        clientInfo(state, action){
            state.client_id = action.payload.client_id
            state.client_secret = action.payload.client_secret
        },
        authInfo(state, action){
            if (action.payload.com === "login") {
                action.payload.state === "open" ? state.login =true : state.login =false
            } else if (action.payload.com === "signup") {
                action.payload.state === "open" ? state.signup = true : state.signup = false
            }else if (action.payload.com === 'reset'){
                action.payload.state === 'open'? state.reset = true: state.reset=false
            } else if (action.payload.com === 'changeCur'){
            action.payload.state === 'open'? state.changeCur = true: state.changeCur=false
            } else if (action.payload.com === 'calculator'){
            action.payload.state === 'open'? state.calculator = true: state.calculator=false
            } else if (action.payload.com === 'search'){
            action.payload.state === 'open'? state.search = true: state.search=false
        }
            
        },
        geoInfo(state, action){
            state.geoData = action.payload
        },
        sympols(state, action){
            state.sympols = action.payload.sympols
        }
    }
})

export const {authInfo, geoInfo, sympols, clientInfo} = constants.actions
export const constantsReducer = constants.reducer