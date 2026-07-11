globalThis.location = { href: "http://localhost:3000/" } as Location;

import { describe, expect, it } from "vitest";
import { apiFetch } from "@/lib/http";
import { listClients } from "../fixtures/clients";
import { listItems } from "../fixtures/items";
import { listTransportTypes } from "../fixtures/transport-types";

function findUnauthorizedPair() {
  const transportTypes = listTransportTypes();
  const client = listClients().find(
    (c) => c.authorizedTransportTypeIds.length < transportTypes.length
  );
  if (!client) {
    throw new Error(
      "No fixture client found that isn't authorized for every transport type"
    );
  }
  const transportType = transportTypes.find(
    (t) => !client.authorizedTransportTypeIds.includes(t.id)
  )!;
  return { client, transportType };
}

describe("POST /api/orders validation", () => {
  it("rejects a transport type not authorized for the client", async () => {
    const { client, transportType } = findUnauthorizedPair();
    const item = listItems()[0];

    await expect(
      apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          clientId: client.id,
          transportTypeId: transportType.id,
          items: [{ itemId: item.id, quantity: 1 }],
        }),
      })
    ).rejects.toThrow("Tipo de transporte não autorizado para este cliente");
  });

  it("rejects a missing clientId", async () => {
    await expect(
      apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({}),
      })
    ).rejects.toThrow("clientId é obrigatório");
  });

  it("rejects a non-existent client", async () => {
    await expect(
      apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({ clientId: "does-not-exist" }),
      })
    ).rejects.toThrow("Cliente não encontrado");
  });
});
