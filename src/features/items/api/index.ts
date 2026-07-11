import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiFetch } from "@/lib/http";
import type { Item } from "../types";

export const itemKeys = {
  all: ["items"] as const,
  list: (search?: string) => [...itemKeys.all, "list", search ?? ""] as const,
};

export function itemsListOptions(search?: string) {
  return queryOptions({
    queryKey: itemKeys.list(search),
    queryFn: () =>
      apiFetch<Item[]>(
        search ? `/api/items?search=${encodeURIComponent(search)}` : "/api/items"
      ),
  });
}

export function useItemsList(search?: string) {
  return useQuery(itemsListOptions(search));
}

export function useItemDetail(id: string) {
  return useQuery({
    ...itemsListOptions(),
    select: (items) => items.find((item) => item.id === id),
  });
}

export interface ItemInput {
  sku: string;
  name: string;
  unit: string;
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ItemInput) =>
      apiFetch<Item>("/api/items", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}
