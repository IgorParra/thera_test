import { describe, expect, it } from "vitest";
import { canTransition, getValidNextStatuses } from "./status-machine";

describe("status-machine", () => {
  it("allows the valid next transition", () => {
    expect(canTransition("CREATED", "PLANNED")).toBe(true);
    expect(getValidNextStatuses("PLANNED")).toEqual(["SCHEDULED"]);
  });

  it("rejects skipping a step", () => {
    expect(canTransition("CREATED", "SCHEDULED")).toBe(false);
    expect(canTransition("PLANNED", "IN_TRANSIT")).toBe(false);
  });

  it("rejects any transition from the final status", () => {
    expect(getValidNextStatuses("DELIVERED")).toEqual([]);
    expect(canTransition("DELIVERED", "CREATED")).toBe(false);
  });
});
