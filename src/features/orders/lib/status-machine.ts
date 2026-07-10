import type { SalesOrderStatus } from "../types";

const ORDER: SalesOrderStatus[] = [
  "CRIADA",
  "PLANEJADA",
  "AGENDADA",
  "EM_TRANSPORTE",
  "ENTREGUE",
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
