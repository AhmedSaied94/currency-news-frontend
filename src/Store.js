import {configureStore} from '@reduxjs/toolkit'
import { userReducer } from './slices/AuthedUser';
import StateLoader from './StateLoader';
import { constantsReducer, clientInfo } from './slices/Constants';
import { allCurrenciesReducer } from './slices/AllCurrencies';
import { newsReducer } from './slices/News';

const stateLoader = new StateLoader()


const Store = configureStore({
    reducer:{
        user:userReducer,
        constants:constantsReducer,
        allCurrencies:allCurrenciesReducer,
        news:newsReducer
        
    },
    preloadedState:stateLoader.loadState()

})


Store.dispatch(clientInfo({
    client_id:"iqWs3fd9E1ppTNQurtNi3NnHgkkr97nrOEFOVeQl",
    client_secret:"OJC3cp7W1GfpPfq3lNPSOw4RttpEz52CvMdMolXVF0mgt5fKsCQRGWqtmcYpoI3iPNIeB1jOD3bwThouVtiGYFq9LnGxxddQVz78LXfY4Dlm2FAFmgpEwX4ARK3RdGQS"
}))
Store.subscribe(() =>{
    const state = Store.getState()
    stateLoader.saveState({
        ...state, 
        constants:{
            ...state.constants,
            client_id:null, 
            client_secret:null, 
            login:false, 
            signup:false
        }, 
        user:{
            ...state.user, 
            authedUser:null
        }, 
        allCurrencies:{
            ...state.allCurrencies, 
            currency:null
        }
    })
})


export default Store;