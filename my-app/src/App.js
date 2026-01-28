import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthAsync, selectLoggedInUser, selectUserChecked } from './features/auth/authSlice';
import UserProfilePage from './pages/UserProfilePage';
import { fetchLoggedInUserAsync } from './features/user/userSlice';
import AdminOrdersPage from './pages/AdminOrdersPage';
import './App.css';
import Home from './pages/home.js'
import LoginPage from './pages/LoginPage.js'
import SignupPage from './pages/SignupPage.js'
import CartPage from './pages/cartPage.js'
import Details from './pages/ProdDetaisPage.js'
import Protected from './features/auth/protected.js';
import Checkout from './pages/checkout';
import PageNotFound from './pages/404';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserOrdersPage from './pages/UserOrdersPage';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import Logout from './features/auth/Logout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProtectedAdmin from './features/auth/ProtectedAdmin';
import AdminHome from './pages/AdminHome';
import AdminProductDetailPage from './pages/AdminProductDetailPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import { positions, Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import StripeCheckout from './pages/StripeCheckout';

const options = {
  timeout: 5000,
  position: positions.BOTTOM_LEFT,
};
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
    path: '/admin/orders',
    element: (
      <ProtectedAdmin>
        <AdminOrdersPage></AdminOrdersPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/my-cart', 
    element: (
      <Protected>
        <CartPage></CartPage>
      </Protected>
    ),
  },
  {
    path: "/Login",
    element: ( <LoginPage></LoginPage>),
  },
  {
    path: '/stripe-checkout/',
    element: (
      <Protected>
        <StripeCheckout></StripeCheckout>
      </Protected>
    ),
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
    path: '/admin',
    element: (
      <ProtectedAdmin>
        <AdminHome></AdminHome>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/product-detail/:id',
    element: (
      <ProtectedAdmin>
        <AdminProductDetailPage></AdminProductDetailPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/product-form',
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: '/admin/product-form/edit/:id',
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
   {
    path: '/order-success/:id',
    element: (
      <Protected>
        <OrderSuccessPage></OrderSuccessPage>{' '}
      </Protected>
    ),
  },
  {
    path: '/my-orders',
    element: (
      <Protected>
        <UserOrdersPage></UserOrdersPage>{' '}
      </Protected>
    ),
  },
  {
    path: '/profile',
    element: (
      <Protected>
        <UserProfilePage></UserProfilePage>{' '}
      </Protected>
    ),
  },
   {
    path: '/logout',
    element: <Logout></Logout>,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage></ForgotPasswordPage>,
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
  const userChecked = useSelector(selectUserChecked);


  useEffect(()=>{
    dispatch(checkAuthAsync())
  },[dispatch])

  useEffect(()=>{
    if(user){
      dispatch(fetchItemsByUserIdAsync());
       // we can get req.user by token on backend so no need to give in front-end
      dispatch(fetchLoggedInUserAsync());
    }
  },[dispatch, user]);

  return (
    <>
      <div className="App">
        { userChecked &&<Provider template={AlertTemplate} {...options}>
          <RouterProvider router={router} />
        </Provider>}
        {/* Link must be inside the Provider */}
      </div>
    </>
  );
}

export default App;
