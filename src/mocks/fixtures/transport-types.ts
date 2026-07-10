import type { TransportType } from "@/features/transport-types/types";

const SEED_DATE = "2026-01-05T08:00:00.000Z";

const transportTypes: TransportType[] = [
  { id: "tt-1", name: "Caminhão", code: "CAMINHAO", createdAt: SEED_DATE },
  { id: "tt-2", name: "Carreta", code: "CARRETA", createdAt: SEED_DATE },
  { id: "tt-3", name: "Bi-truck", code: "BITRUCK", createdAt: SEED_DATE },
];

let nextId = transportTypes.length + 1;

export function listTransportTypes(): TransportType[] {
  return transportTypes;
}

export function getTransportTypeById(id: string): TransportType | undefined {
  return transportTypes.find((t) => t.id === id);
}

export function createTransportType(input: {
  name: string;
  code: string;
}): TransportType {
  const transportType: TransportType = {
    id: `tt-${nextId++}`,
    name: input.name,
    code: input.code,
    createdAt: new Date().toISOString(),
  };
  transportTypes.push(transportType);
  return transportType;
}

export function updateTransportType(
  id: string,
  input: { name: string; code: string }
): TransportType | undefined {
  const transportType = getTransportTypeById(id);
  if (!transportType) return undefined;
  transportType.name = input.name;
  transportType.code = input.code;
  return transportType;
}
