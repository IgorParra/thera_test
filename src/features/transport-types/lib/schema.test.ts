import { describe, expect, it } from "vitest";
import { transportTypeFormSchema } from "./schema";

describe("transportTypeFormSchema", () => {
  it("accepts a valid transport type", () => {
    const result = transportTypeFormSchema.safeParse({
      name: "Rodoviário",
      code: "ROD",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = transportTypeFormSchema.safeParse({
      name: "  ",
      code: "ROD",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing code", () => {
    const result = transportTypeFormSchema.safeParse({
      name: "Rodoviário",
      code: "",
    });
    expect(result.success).toBe(false);
  });
});
