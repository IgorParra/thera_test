import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { itemKeys } from "@/features/items/api";
import { ItemsPageClient } from "@/features/items/components/ItemsPageClient";
import { getQueryClient } from "@/lib/query-client";
import { listItems } from "@/mocks/fixtures/items";

export default async function ItemsPage() {
  const queryClient = getQueryClient();

  queryClient.setQueryData(itemKeys.list(), listItems());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ItemsPageClient />
    </HydrationBoundary>
  );
}
