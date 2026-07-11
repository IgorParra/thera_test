// @vitest-environment jsdom

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import { makeStore } from "@/lib/redux/store";
import { setStatus } from "@/lib/redux/slices/orders-filter-slice";
import { OrdersPageClient } from "./OrdersPageClient";

function renderOrdersPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const store = makeStore();
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <OrdersPageClient />
      </Provider>
    </QueryClientProvider>
  );
  return { ...utils, store };
}

describe("OrdersPageClient", () => {
  it("lists all seeded orders by default, filters by status via Redux, and resets via the clear button", async () => {
    const { store } = renderOrdersPage();

    expect(await screen.findByText("order-1")).toBeInTheDocument();

    act(() => {
      store.dispatch(setStatus("DELIVERED"));
    });

    expect(await screen.findByText("order-11")).toBeInTheDocument();
    expect(screen.queryByText("order-1")).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Limpar filtros" }));

    expect(await screen.findByText("order-1")).toBeInTheDocument();
  });
});
