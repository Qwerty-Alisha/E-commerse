import { configureStore } from "@reduxjs/toolkit";
import productReducer from  '../productSlice.js'
import authReducer from '../../src/featues/auth/authSlice.js';
import cartReducer from '../featues/cart/cartSlice';

export const store= configureStore({
    reducer:{
        product: productReducer,
        auth: authReducer,
        cart: cartReducer
    },
    devTools: true,
})