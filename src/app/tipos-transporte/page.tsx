import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { TransportTypesPageClient } from "@/features/transport-types/components/TransportTypesPageClient";
import { transportTypeKeys } from "@/features/transport-types/api";
import { getQueryClient } from "@/lib/query-client";
import { listTransportTypes } from "@/mocks/fixtures/transport-types";

export default async function TransportTypesPage() {
  const queryClient = getQueryClient();

  queryClient.setQueryData(transportTypeKeys.list(), listTransportTypes());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TransportTypesPageClient />
    </HydrationBoundary>
  );
}
