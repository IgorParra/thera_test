import { describe, expect, it } from "vitest";
import { clientFormSchema } from "./schema";

describe("clientFormSchema", () => {
  it("accepts a valid client with transport types selected", () => {
    const result = clientFormSchema.safeParse({
      name: "Acme Ltda",
      document: "12345678000199",
      authorizedTransportTypeIds: ["transport-1"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty authorizedTransportTypeIds array", () => {
    const result = clientFormSchema.safeParse({
      name: "Acme Ltda",
      document: "12345678000199",
      authorizedTransportTypeIds: [],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = clientFormSchema.safeParse({
      name: "  ",
      document: "12345678000199",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing document", () => {
    const result = clientFormSchema.safeParse({
      name: "Acme Ltda",
      document: "",
    });
    expect(result.success).toBe(false);
  });
});
