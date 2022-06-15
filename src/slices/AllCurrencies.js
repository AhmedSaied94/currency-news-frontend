import { createSlice } from "@reduxjs/toolkit";

const allCurrencies = createSlice({
    name:'allCurrencies',
    initialState:{},
    reducers:{
        // setPaperCurs(state, action){
        //     state.paperCurrencies = action.payload.paperCurrencies
        // },
        setBases(state, action){
            state.basesCurrencies = action.payload.basesCurrencies
        },
        setMetals(state, action){
            state.metals= action.payload.metals
        },
        setCurrency(state, action){
            console.log(action.payload.currency)
            state.currency = action.payload.currency
        }
    }
})
export  const {setPaperCurs, setBases, setMetals, setCurrency} = allCurrencies.actions
export const allCurrenciesReducer = allCurrencies.reducer