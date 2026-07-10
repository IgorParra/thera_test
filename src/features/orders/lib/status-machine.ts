import type { SalesOrderStatus } from "../types";

export const SALES_ORDER_STATUS_SEQUENCE: SalesOrderStatus[] = [
  "CREATED",
  "PLANNED",
  "SCHEDULED",
  "IN_TRANSIT",
  "DELIVERED",
];

export function getValidNextStatuses(
  current: SalesOrderStatus
): SalesOrderStatus[] {
  const index = SALES_ORDER_STATUS_SEQUENCE.indexOf(current);
  const next = SALES_ORDER_STATUS_SEQUENCE[index + 1];
  return next ? [next] : [];
}

export function canTransition(
  from: SalesOrderStatus,
  to: SalesOrderStatus
): boolean {
  return getValidNextStatuses(from).includes(to);
}
