import './App.css';
import Home from './pages/home.js'
import LoginPage from './pages/LoginPage.js'
import SignupPage from './pages/SignupPage.js'
import CartPage from './pages/cartPage.js'
import Details from './pages/ProdDetaisPage.js'
import * as React from "react";
import { createRoot } from "react-dom/client";
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
  element: (<CartPage></CartPage>),
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
    path: "/ProdDetails",
    element: (
      <Details></Details>
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
