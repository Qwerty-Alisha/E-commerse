import { configureStore } from "@reduxjs/toolkit";
import productReducer from  '../productSlice.js'
import authReducer from '../../src/featues/auth/authSlice.js';
import cartReducer from '../featues/cart/cartSlice';
import orderReducer from '../featues/order/orderSlice';
import userReducer from '../featues/user/userSlice';

export const store= configureStore({
    reducer:{
        product: productReducer,
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
        user: userReducer,
    },
    devTools: true,
})