import { configureStore } from "@reduxjs/toolkit";
import ordersFilterReducer from "./slices/orders-filter-slice";
import orderWizardReducer from "./slices/order-wizard-slice";

export function makeStore() {
  return configureStore({
    reducer: {
      ordersFilter: ordersFilterReducer,
      orderWizard: orderWizardReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
