import type { OrdersListFilters } from "@/features/orders/api";
import type { SalesOrder } from "@/features/orders/types";

export function filterOrders(
  orders: SalesOrder[],
  filters: OrdersListFilters
): SalesOrder[] {
  return orders.filter((order) => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.clientId && order.clientId !== filters.clientId) return false;
    if (
      filters.transportTypeId &&
      order.transportTypeId !== filters.transportTypeId
    )
      return false;
    if (filters.dateFrom && order.createdAt < filters.dateFrom) return false;
    if (filters.dateTo && order.createdAt > filters.dateTo) return false;
    return true;
  });
}
