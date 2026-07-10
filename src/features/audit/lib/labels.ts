import { SALES_ORDER_STATUS_LABELS } from "@/features/orders/lib/status-labels";
import type { SalesOrderStatus } from "@/features/orders/types";
import type { AuditEvent } from "../types";

const AUDIT_ACTION_LABELS: Record<string, string> = {
  CREATED: "Ordem criada",
  STATUS_CHANGED: "Status alterado",
  SCHEDULING_SET: "Agendamento definido",
  SCHEDULING_CONFIRMED: "Agendamento confirmado",
};

export function describeAuditEvent(event: AuditEvent): {
  label: string;
  transition?: string;
} {
  const label = AUDIT_ACTION_LABELS[event.action] ?? event.action;

  if (event.action === "STATUS_CHANGED") {
    const previousStatus = event.previousState?.status as
      | SalesOrderStatus
      | undefined;
    const nextStatus = event.nextState?.status as SalesOrderStatus | undefined;
    if (previousStatus && nextStatus) {
      return {
        label,
        transition: `${SALES_ORDER_STATUS_LABELS[previousStatus]} → ${SALES_ORDER_STATUS_LABELS[nextStatus]}`,
      };
    }
  }

  return { label };
}
