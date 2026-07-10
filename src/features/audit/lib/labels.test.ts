import { describe, expect, it } from "vitest";
import { describeAuditEvent } from "./labels";
import type { AuditEvent } from "../types";

function makeEvent(overrides: Partial<AuditEvent>): AuditEvent {
  return {
    id: "audit-1",
    entityType: "order",
    entityId: "order-1",
    action: "CREATED",
    occurredAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("describeAuditEvent", () => {
  it("describes a CREATED event without a transition", () => {
    const result = describeAuditEvent(makeEvent({ action: "CREATED" }));
    expect(result.label).toBe("Ordem criada");
    expect(result.transition).toBeUndefined();
  });

  it("describes a STATUS_CHANGED event with a previous -> next transition", () => {
    const result = describeAuditEvent(
      makeEvent({
        action: "STATUS_CHANGED",
        previousState: { status: "CREATED" },
        nextState: { status: "PLANNED" },
      })
    );
    expect(result.label).toBe("Status alterado");
    expect(result.transition).toBe("Criada → Planejada");
  });

  it("falls back to the raw action for unmapped actions", () => {
    const result = describeAuditEvent(makeEvent({ action: "SOMETHING_ELSE" }));
    expect(result.label).toBe("SOMETHING_ELSE");
  });
});
