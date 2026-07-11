import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { auditKeys } from "@/features/audit/api";
import { clientKeys } from "@/features/clients/api";
import { itemKeys } from "@/features/items/api";
import { orderKeys } from "@/features/orders/api";
import { OrderDetailPageClient } from "@/features/orders/components/OrderDetailPageClient";
import { transportTypeKeys } from "@/features/transport-types/api";
import { getQueryClient } from "@/lib/query-client";
import { listAudit } from "@/mocks/fixtures/audit";
import { listClients } from "@/mocks/fixtures/clients";
import { getOrderById } from "@/mocks/fixtures/orders";
import { listItems } from "@/mocks/fixtures/items";
import { listTransportTypes } from "@/mocks/fixtures/transport-types";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();

  const order = getOrderById(id);
  if (order) {
    queryClient.setQueryData(orderKeys.detail(id), order);
  }
  queryClient.setQueryData(clientKeys.list(), listClients());
  queryClient.setQueryData(transportTypeKeys.list(), listTransportTypes());
  queryClient.setQueryData(itemKeys.list(), listItems());
  queryClient.setQueryData(
    auditKeys.list({ entityType: "order", entityId: id }),
    listAudit({ entityType: "order", entityId: id })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OrderDetailPageClient id={id} />
    </HydrationBoundary>
  );
}
