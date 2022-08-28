import {createReducer,createAction} from "@reduxjs/toolkit";
const initialState = {
    user: null
}

const createUser = createAction('createUser' , (user)=>{
    return {
        payload: user
    }
});

export const userReducer = createReducer((initialState), (builder)=>{
    builder.addCase(createUser , (state, action)=>{
        if(action && action.payload){
            initialState.user = action.payload;
        }
    })
});