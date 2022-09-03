import {createReducer,createAction} from "@reduxjs/toolkit";
const initialState = {
    user: null,
    eventInfo:[]
}


export const loggUser = createAction('loggedUserDetails' , (user)=>{
    return {
        payload: user
    }
});

export const addEvents = createAction('addEvent', (eventInfo)=>{
    return {
        payload: eventInfo
    }
});

export const userReducer = createReducer((initialState), (builder)=>{
    builder.addCase(loggUser , (state, action)=>{
        if(action && action.payload){
            state.user = action.payload;
        }
    })
    .addCase(addEvents, (state, action)=>{
        if(action && action.payload){
            state.eventInfo = [...state.eventInfo, action.payload];
        }
    })
});