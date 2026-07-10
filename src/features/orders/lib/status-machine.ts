import type { SalesOrderStatus } from "../types";

const ORDER: SalesOrderStatus[] = [
  "CREATED",
  "PLANNED",
  "SCHEDULED",
  "IN_TRANSIT",
  "DELIVERED",
];

export function getValidNextStatuses(
  current: SalesOrderStatus
): SalesOrderStatus[] {
  const index = ORDER.indexOf(current);
  const next = ORDER[index + 1];
  return next ? [next] : [];
}

export function canTransition(
  from: SalesOrderStatus,
  to: SalesOrderStatus
): boolean {
  return getValidNextStatuses(from).includes(to);
}
