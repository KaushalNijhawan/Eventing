import {createReducer,createAction} from "@reduxjs/toolkit";
const initialState = {
    user: null,
    eventInfo:[],
    bookingIds :[]
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

export const addBookingIds = createAction('addBookingIds' , (bookingIds)=>{
    return {
        payload : bookingIds
    }
});

export const updateBookingIds = createAction("updateBookingList" ,(bookingIds)=>{
    return {
        payload : bookingIds
    }
});

export const userReducer = createReducer((initialState), (builder)=>{
    builder.addCase(loggUser , (state, action)=>{
        if(action && action.payload){
            state.user = action.payload
        }
    })
    .addCase(addEvents, (state, action)=>{
        if(action && action.payload){
            state.eventInfo = [...state.eventInfo, action.payload];
        }
    })
    .addCase(addBookingIds, (state, action)=>{
        if(action && action.payload && action.payload.bookingIds){
            state.bookingIds = [...state.bookingIds, action.payload.bookingIds[0]];
        }
    }).addCase(updateBookingIds, (state, action)=>{
        if(action && action.payload){
            state.bookingIds = action.payload.bookingIds;
        }
    })
});