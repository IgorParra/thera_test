import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { clientKeys } from "@/features/clients/api";
import { ClientsPageClient } from "@/features/clients/components/ClientsPageClient";
import { transportTypeKeys } from "@/features/transport-types/api";
import { getQueryClient } from "@/lib/query-client";
import { listClients } from "@/mocks/fixtures/clients";
import { listTransportTypes } from "@/mocks/fixtures/transport-types";

export default async function ClientsPage() {
  const queryClient = getQueryClient();

  queryClient.setQueryData(clientKeys.list(), listClients());
  queryClient.setQueryData(transportTypeKeys.list(), listTransportTypes());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientsPageClient />
    </HydrationBoundary>
  );
}
