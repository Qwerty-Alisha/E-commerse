import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { resetCartAsync } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedInUser } from "../features/auth/authSlice";
import { resetOrder, selectCurrentOrder } from "../features/order/orderSlice";

function OrderSuccessPage() {
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);

  useEffect(() => {
    // ✅ Reset cart immediately
    dispatch(resetCartAsync());

    // ✅ Delay resetting currentOrder to allow the page to show first
    const timer = setTimeout(() => {
      dispatch(resetOrder());
    }, 5000); // 5 seconds delay

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, [dispatch]);

  // If order not found, redirect
  if (!currentOrder?.serialNumber) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">Order Successfully Placed</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Order Number: {currentOrder.serialNumber}
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          You can check your order in My Account &gt; My Orders
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccessPage;
