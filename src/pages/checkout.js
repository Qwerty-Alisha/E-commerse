import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserAsync } from "../user/userSlice";
import { CreateOrderAsync, resetOrder } from "../order/orderSlice";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user?.userInfo ?? {});
  const items = useSelector((state) => state.cart?.items ?? []);
  const orderStatus = useSelector((state) => state.order?.status);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [addingAddress, setAddingAddress] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: userInfo?.email || "",
    phone: "",
    street: "",
    city: "",
    pinCode: "",
  });

  // ✅ Handle Address Form Changes
  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Add New Address Safely
  const handleAddAddress = (e) => {
    e.preventDefault();

    const currentAddresses = Array.isArray(userInfo?.addresses)
      ? userInfo.addresses
      : [];

    const updatedUser = {
      ...userInfo,
      addresses: [...currentAddresses, formData],
    };

    dispatch(updateUserAsync(updatedUser));
    setAddingAddress(false);

    setFormData({
      name: "",
      email: userInfo?.email || "",
      phone: "",
      street: "",
      city: "",
      pinCode: "",
    });
  };

  // ✅ Handle Selecting an Address
  const handleAddressSelect = (e) => {
    setSelectedAddress(e.target.value);
  };

  // ✅ Handle Order Placement
  const handleOrder = () => {
    const addressList = Array.isArray(userInfo?.addresses)
      ? userInfo.addresses
      : [];

    const orderData = {
      items,
      address: addressList[selectedAddress],
      paymentMethod,
    };

    dispatch(CreateOrderAsync(orderData));
  };

  // ✅ Redirect After Successful Order
  useEffect(() => {
    if (orderStatus === "success") {
      dispatch(resetOrder());
      navigate("/order-success");
    }
  }, [orderStatus]);

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-xl font-bold mb-4">Checkout</h1>

      {/* ✅ Address List */}
      <h2 className="text-lg font-semibold mb-2">Select Address</h2>

      {Array.isArray(userInfo?.addresses) && userInfo.addresses.length > 0 ? (
        <ul>
          {userInfo.addresses.map((address, index) => (
            <li
              key={index}
              className="flex justify-between gap-x-6 px-5 py-5 border-solid border-2 border-gray-200 mb-2"
            >
              <div className="flex gap-x-4">
                <input
                  type="radio"
                  name="address"
                  value={index}
                  onChange={handleAddressSelect}
                />
                <div>
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-sm text-gray-600">{address.street}</p>
                  <p className="text-sm text-gray-600">{address.city}</p>
                  <p className="text-sm text-gray-600">{address.pinCode}</p>
                  <p className="text-sm text-gray-600">
                    Phone: {address.phone}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No saved addresses.</p>
      )}

      {/* ✅ Add Address Button */}
      {!addingAddress && (
        <button
          onClick={() => setAddingAddress(true)}
          className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Add New Address
        </button>
      )}

      {/* ✅ Address Form */}
      {addingAddress && (
        <form onSubmit={handleAddAddress} className="mt-4 space-y-3">
          <input
            name="name"
            placeholder="Full Name"
            className="border p-2 w-full"
            onChange={handleFormChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            className="border p-2 w-full"
            onChange={handleFormChange}
            required
          />
          <input
            name="street"
            placeholder="Street"
            className="border p-2 w-full"
            onChange={handleFormChange}
            required
          />
          <input
            name="city"
            placeholder="City"
            className="border p-2 w-full"
            onChange={handleFormChange}
            required
          />
          <input
            name="pinCode"
            placeholder="Pin Code"
            className="border p-2 w-full"
            onChange={handleFormChange}
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            Save Address
          </button>
        </form>
      )}

      {/* ✅ Payment Section */}
      <h2 className="text-lg font-semibold mt-6 mb-2">Payment Method</h2>

      <select
        className="border p-2 w-full"
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="">Select Payment Method</option>
        <option value="cod">Cash on Delivery</option>
        <option value="online">Online Payment</option>
      </select>

      {/* ✅ Order Button */}
      <button
        onClick={handleOrder}
        disabled={!selectedAddress || !paymentMethod || !items.length}
        className="mt-5 bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded w-full"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
