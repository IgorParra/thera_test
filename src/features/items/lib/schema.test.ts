import { describe, expect, it } from "vitest";
import { itemFormSchema } from "./schema";

describe("itemFormSchema", () => {
  it("accepts a valid item", () => {
    const result = itemFormSchema.safeParse({
      sku: "SKU-0001",
      name: "Caixa de papelão",
      unit: "CX",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing sku", () => {
    const result = itemFormSchema.safeParse({
      sku: "",
      name: "Caixa de papelão",
      unit: "CX",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing name", () => {
    const result = itemFormSchema.safeParse({
      sku: "SKU-0001",
      name: "  ",
      unit: "CX",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a unit outside the allowed set", () => {
    const result = itemFormSchema.safeParse({
      sku: "SKU-0001",
      name: "Caixa de papelão",
      unit: "XX",
    });
    expect(result.success).toBe(false);
  });
});
