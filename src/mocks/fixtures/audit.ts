import type { AuditEvent } from "@/features/audit/types";

const auditEvents: AuditEvent[] = [];

let nextId = 1;

export function addAuditEvent(
  input: Omit<AuditEvent, "id" | "occurredAt">
): AuditEvent {
  const event: AuditEvent = {
    ...input,
    id: `audit-${nextId++}`,
    occurredAt: new Date().toISOString(),
  };
  auditEvents.push(event);
  return event;
}

export function listAudit(filters: {
  entityType?: string;
  entityId?: string;
}): AuditEvent[] {
  return auditEvents.filter(
    (event) =>
      (!filters.entityType || event.entityType === filters.entityType) &&
      (!filters.entityId || event.entityId === filters.entityId)
  );
}
