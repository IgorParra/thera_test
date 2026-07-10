import type { SalesOrderStatus } from "../types";

export const SALES_ORDER_STATUS_LABELS: Record<SalesOrderStatus, string> = {
  CREATED: "Criada",
  PLANNED: "Planejada",
  SCHEDULED: "Agendada",
  IN_TRANSIT: "Em Transporte",
  DELIVERED: "Entregue",
};
