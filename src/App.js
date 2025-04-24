import './App.css';
import Home from './pages/home.js'
import LoginPage from './pages/LoginPage.js'
import SignupPage from './pages/SignupPage.js'
import CartPage from './pages/cartPage.js'
import Details from './pages/ProdDetaisPage.js'
import Protected from './featues/auth/protected.js';
import Cart from './featues/cart/cart';
import cart_page from './pages/cartPage';
import * as React from "react";
import { createRoot } from "react-dom/client";
import { fetchItemsByUserIdAsync } from './featues/cart/cartSlice';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

const router = createBrowserRouter([
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
]);
function App() {
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}
export default App;
