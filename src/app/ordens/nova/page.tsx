import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { clientKeys } from "@/features/clients/api";
import { itemKeys } from "@/features/items/api";
import { NewOrderPageClient } from "@/features/orders/components/NewOrderPageClient";
import { transportTypeKeys } from "@/features/transport-types/api";
import { getQueryClient } from "@/lib/query-client";
import { listClients } from "@/mocks/fixtures/clients";
import { listItems } from "@/mocks/fixtures/items";
import { listTransportTypes } from "@/mocks/fixtures/transport-types";

export default async function NewOrderPage() {
  const queryClient = getQueryClient();

  queryClient.setQueryData(clientKeys.list(), listClients());
  queryClient.setQueryData(transportTypeKeys.list(), listTransportTypes());
  queryClient.setQueryData(itemKeys.list(), listItems());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewOrderPageClient />
    </HydrationBoundary>
  );
}
