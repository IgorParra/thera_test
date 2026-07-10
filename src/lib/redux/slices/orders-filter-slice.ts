import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SalesOrderStatus } from "@/features/orders/types";

export interface DateRange {
  from: string | null;
  to: string | null;
}

export interface OrdersFilterState {
  status: SalesOrderStatus | null;
  clientId: string | null;
  transportTypeId: string | null;
  dateRange: DateRange;
}

const initialState: OrdersFilterState = {
  status: null,
  clientId: null,
  transportTypeId: null,
  dateRange: { from: null, to: null },
};

const ordersFilterSlice = createSlice({
  name: "ordersFilter",
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<SalesOrderStatus | null>) {
      state.status = action.payload;
    },
    setClientId(state, action: PayloadAction<string | null>) {
      state.clientId = action.payload;
    },
    setTransportTypeId(state, action: PayloadAction<string | null>) {
      state.transportTypeId = action.payload;
    },
    setDateRange(state, action: PayloadAction<DateRange>) {
      state.dateRange = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setStatus,
  setClientId,
  setTransportTypeId,
  setDateRange,
  resetFilters,
} = ordersFilterSlice.actions;

export default ordersFilterSlice.reducer;
