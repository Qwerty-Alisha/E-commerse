import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder } from './orderAPI';

const initialState = {
  orders: [],
  status: 'idle',
  currentOrder: null,
};

// export const createOrderAsync = createAsyncThunk(
//   'order/createOrder',
//   async (order) => {
//     const response = await createOrder(order);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );
export const createOrderAsync = createAsyncThunk(
  'order/createOrder',
  async (order) => {
    const serialNumber = generateOrderSerial();
    const orderPlacedAt = new Date().toLocaleString();;
    const response = await createOrder({ ...order, serialNumber, orderPlacedAt });
    return response.data;
  }
);

function generateOrderSerial() {
  const prefix = 'ORD';
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${random}`;
}

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export const selectCurrentOrder = (state) => state.order.currentOrder;

export default orderSlice.reducer;