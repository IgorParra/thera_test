import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiFetch } from "@/lib/http";
import type {
  SalesOrder,
  SalesOrderItem,
  SalesOrderStatus,
} from "../types";

export interface OrdersListFilters {
  status?: SalesOrderStatus;
  clientId?: string;
  transportTypeId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const orderKeys = {
  all: ["orders"] as const,
  list: (filters: OrdersListFilters = {}) =>
    [...orderKeys.all, "list", filters] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

function buildOrdersQueryString(filters: OrdersListFilters): string {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.clientId) params.set("clientId", filters.clientId);
  if (filters.transportTypeId)
    params.set("transportTypeId", filters.transportTypeId);
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function useOrdersList(filters: OrdersListFilters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () =>
      apiFetch<SalesOrder[]>(`/api/orders${buildOrdersQueryString(filters)}`),
  });
}

export function useOrderDetail(id: string) {
  return useQuery(
    queryOptions({
      queryKey: orderKeys.detail(id),
      queryFn: () => apiFetch<SalesOrder>(`/api/orders/${id}`),
      enabled: !!id,
    })
  );
}

export interface CreateOrderInput {
  clientId: string;
  transportTypeId: string;
  items: SalesOrderItem[];
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) =>
      apiFetch<SalesOrder>("/api/orders", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SalesOrderStatus }) =>
      apiFetch<SalesOrder>(`/api/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}

export interface SetOrderSchedulingInput {
  id: string;
  deliveryDate: string;
  windowStart: string;
  windowEnd: string;
}

export function useSetOrderScheduling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: SetOrderSchedulingInput) =>
      apiFetch<SalesOrder>(`/api/orders/${id}/scheduling`, {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}

export interface ConfirmOrderSchedulingResult {
  order: SalesOrder;
  statusTransitioned: boolean;
}

export function useConfirmOrderScheduling() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      transitionToScheduled,
    }: {
      id: string;
      transitionToScheduled?: boolean;
    }) =>
      apiFetch<ConfirmOrderSchedulingResult>(
        `/api/orders/${id}/scheduling/confirm`,
        {
          method: "PATCH",
          body: JSON.stringify({ transitionToScheduled }),
        }
      ),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
    },
  });
}
