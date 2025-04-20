import { configureStore } from "@reduxjs/toolkit";
import productReducer from  '../productSlice.js'
import authReducer from '../../src/featues/auth/authSlice.js';

export const store= configureStore({
    reducer:{
        product: productReducer,
        auth: authReducer
    },
    devTools: true,
})