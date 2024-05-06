import { ProductProps } from "@/type";
import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  numberCart: number;
  cartArr: ProductProps[];
}
const initialState: CartState = {
  numberCart: 0,
  cartArr: [],
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCart: (state) => {
      return { ...state };
    },
    clearAllCart: (state) => {
      state.cartArr = [];
      state.numberCart = 0;
    },
    AddAllItemCart: (state, action: PayloadAction<ProductProps[]>) => {
      state.cartArr = action.payload;
      state.numberCart = action.payload.length;
    },
    AddToCart: (state, action: PayloadAction<ProductProps | any>) => {
      if (state.numberCart === 0) {
        state.cartArr.push(action.payload);
      } else {
        let check = false;
        state.cartArr.map((item) => {
          if (item.id === action.payload.id) {
            let _quantityCur = item.quantity + action.payload.quantity;
            item.quantity = _quantityCur;
            check = true;
          }
        });
        if (!check) {
          let _cartNew = action.payload;
          state.cartArr.push(_cartNew);
        }
      }
      state.numberCart++;
    },
    deleteItemCart: (state, action: PayloadAction<ProductProps>) => {
      state.numberCart--;
      state.cartArr = state.cartArr.filter(
        (item) => item.id !== action.payload.id
      );
    },
    // decreaseQuantity: (
    //   state,
    //   action: PayloadAction<{
    //     id: string;
    //     quantity: number;
    //   }>
    // ) => {
    //   state.cartArr.map((item) => {
    //     if (item.id === action.payload.id) {
    //       item.quantity = action.payload.quantity;
    //       item.total = action.payload.quantity * item.price;
    //     }
    //   });
    // },
    // increaseQuantity: (
    //   state,
    //   action: PayloadAction<{
    //     id: string;
    //     quantity: number;
    //   }>
    // ) => {
    //   state.cartArr.map((item) => {
    //     if (item.id === action.payload.id) {
    //         item.quantity = action.payload.quantity;
    //         item.total = action.payload.quantity * item.price;
    //     }
    //   });
    // },
  },
});

export const {
  AddAllItemCart,
  AddToCart,
  deleteItemCart,
  getCart,
  clearAllCart,
  //   decreaseQuantity,
  //   increaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
