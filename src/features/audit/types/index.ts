export interface AuditEvent {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  previousState?: Record<string, unknown>;
  nextState?: Record<string, unknown>;
  occurredAt: string;
}
