


import './App.css';
import Home from './pages/home.js'
import LoginPage from './pages/LoginPage.js'
import SignupPage from './pages/SignupPage.js'
import CartPage from './pages/cartPage.js'
import Details from './pages/ProdDetaisPage.js'
import Protected from './featues/auth/protected.js';
import Cart from './featues/cart/cart';
import cart_page from './pages/cartPage';
import Checkout from './pages/checkout';
import PageNotFound from './pages/404';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserOrders from './featues/user/components/UserOrders';
import UserOrdersPage from './pages/UserOrdersPage';
import * as React from "react";
import { createRoot } from "react-dom/client";
import { fetchItemsByUserIdAsync } from './featues/cart/cartSlice';



import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser } from './featues/auth/authSlice';
const router = createBrowserRouter([
  {
    path: '/checkout',
    element: (
      <Protected>
        <Checkout></Checkout>
      </Protected>
    ),
  },
  {
    path: "/",
    element: (
      <Home></Home>
    ),
  },
  {
  path: "/cart",
  element: (<Protected><CartPage></CartPage></Protected>),
},
  {
    path: "/Login",
    element: ( <LoginPage></LoginPage>),
  },
  {
    path: "/Signup",
    element: ( <SignupPage></SignupPage>),
  },
  {
    path: "/ProdDetails/:id",
    element: (
      <Protected><Details></Details></Protected>
    ),
  },
   {
    path: '/order-success/:id',
    element: (
      <OrderSuccessPage></OrderSuccessPage>
    ),
  },
  {
    path: '/orders',
    element: (
      <UserOrdersPage></UserOrdersPage>
      // we will add Page later right now using component directly.
    ),
  },
  {
    path: '*',
    element: (
      <PageNotFound></PageNotFound>
    ),
  },
]);

function App() {

  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  useEffect(()=>{
    if(user){
      dispatch(fetchItemsByUserIdAsync(user.id))
    }
  },[dispatch, user])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;