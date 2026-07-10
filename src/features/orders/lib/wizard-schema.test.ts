import { describe, expect, it } from "vitest";
import {
  clientStepSchema,
  itemsStepSchema,
  transportStepSchema,
} from "./wizard-schema";

describe("clientStepSchema", () => {
  it("accepts a selected client", () => {
    expect(clientStepSchema.safeParse({ clientId: "client-1" }).success).toBe(
      true
    );
  });

  it("rejects a missing client", () => {
    expect(clientStepSchema.safeParse({ clientId: "" }).success).toBe(false);
  });
});

describe("transportStepSchema", () => {
  it("accepts a selected transport type", () => {
    expect(
      transportStepSchema.safeParse({ transportTypeId: "tt-1" }).success
    ).toBe(true);
  });

  it("rejects a missing transport type", () => {
    expect(transportStepSchema.safeParse({ transportTypeId: "" }).success).toBe(
      false
    );
  });
});

describe("itemsStepSchema", () => {
  it("accepts at least one item with valid quantity", () => {
    const result = itemsStepSchema.safeParse({
      items: [{ itemId: "item-1", quantity: 2 }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty items array", () => {
    expect(itemsStepSchema.safeParse({ items: [] }).success).toBe(false);
  });

  it("rejects a zero quantity", () => {
    const result = itemsStepSchema.safeParse({
      items: [{ itemId: "item-1", quantity: 0 }],
    });
    expect(result.success).toBe(false);
  });
});
