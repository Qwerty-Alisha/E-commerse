import { configureStore } from "@reduxjs/toolkit";
import productReducer from  '../productSlice.js'

export const store= configureStore({
    reducer:{
        product: productReducer,
    },
    devTools: true,
})