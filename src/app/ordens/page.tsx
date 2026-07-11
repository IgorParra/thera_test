import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { clientKeys } from "@/features/clients/api";
import { orderKeys } from "@/features/orders/api";
import { OrdersPageClient } from "@/features/orders/components/OrdersPageClient";
import { transportTypeKeys } from "@/features/transport-types/api";
import { getQueryClient } from "@/lib/query-client";
import { listClients } from "@/mocks/fixtures/clients";
import { listOrders } from "@/mocks/fixtures/orders";
import { listTransportTypes } from "@/mocks/fixtures/transport-types";
import { filterOrders } from "@/mocks/lib/filter-orders";

export default async function OrdersPage() {
  const queryClient = getQueryClient();

  queryClient.setQueryData(orderKeys.list({}), filterOrders(listOrders(), {}));
  queryClient.setQueryData(clientKeys.list(), listClients());
  queryClient.setQueryData(transportTypeKeys.list(), listTransportTypes());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrdersPageClient />
    </HydrationBoundary>
  );
}
