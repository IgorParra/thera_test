import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SalesOrderItem } from "@/features/orders/types";

export interface OrderWizardData {
  clientId?: string;
  transportTypeId?: string;
  items?: SalesOrderItem[];
}

export interface OrderWizardState {
  step: number;
  data: OrderWizardData;
}

const initialState: OrderWizardState = {
  step: 0,
  data: {},
};

const orderWizardSlice = createSlice({
  name: "orderWizard",
  initialState,
  reducers: {
    setStep(state, action: PayloadAction<number>) {
      state.step = action.payload;
    },
    nextStep(state) {
      state.step += 1;
    },
    prevStep(state) {
      state.step = Math.max(0, state.step - 1);
    },
    updateWizardData(state, action: PayloadAction<OrderWizardData>) {
      state.data = { ...state.data, ...action.payload };
    },
    resetWizard() {
      return initialState;
    },
  },
});

export const { setStep, nextStep, prevStep, updateWizardData, resetWizard } =
  orderWizardSlice.actions;

export default orderWizardSlice.reducer;
