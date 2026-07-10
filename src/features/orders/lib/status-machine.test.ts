import { describe, expect, it } from "vitest";
import { canTransition, getValidNextStatuses } from "./status-machine";

describe("status-machine", () => {
  it("allows the valid next transition", () => {
    expect(canTransition("CRIADA", "PLANEJADA")).toBe(true);
    expect(getValidNextStatuses("PLANEJADA")).toEqual(["AGENDADA"]);
  });

  it("rejects skipping a step", () => {
    expect(canTransition("CRIADA", "AGENDADA")).toBe(false);
    expect(canTransition("PLANEJADA", "EM_TRANSPORTE")).toBe(false);
  });

  it("rejects any transition from the final status", () => {
    expect(getValidNextStatuses("ENTREGUE")).toEqual([]);
    expect(canTransition("ENTREGUE", "CRIADA")).toBe(false);
  });
});
