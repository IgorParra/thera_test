import { faker } from "@faker-js/faker";
import type { Client } from "@/features/clients/types";
import { listTransportTypes } from "./transport-types";

const CLIENT_COUNT = 10;

function generateClients(): Client[] {
  faker.seed(1001);
  const transportTypeIds = listTransportTypes().map((t) => t.id);

  return Array.from({ length: CLIENT_COUNT }, (_, index) => ({
    id: `client-${index + 1}`,
    name: faker.company.name(),
    document: faker.string.numeric(14),
    authorizedTransportTypeIds: faker.helpers.arrayElements(transportTypeIds, {
      min: 1,
      max: transportTypeIds.length,
    }),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  }));
}

const clients: Client[] = generateClients();

let nextId = clients.length + 1;

export function listClients(): Client[] {
  return clients;
}

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function createClient(input: {
  name: string;
  document: string;
  authorizedTransportTypeIds?: string[];
}): Client {
  const client: Client = {
    id: `client-${nextId++}`,
    name: input.name,
    document: input.document,
    authorizedTransportTypeIds: input.authorizedTransportTypeIds ?? [],
    createdAt: new Date().toISOString(),
  };
  clients.push(client);
  return client;
}

export function updateClient(
  id: string,
  input: { name: string; document: string; authorizedTransportTypeIds?: string[] }
): Client | undefined {
  const client = getClientById(id);
  if (!client) return undefined;
  client.name = input.name;
  client.document = input.document;
  if (input.authorizedTransportTypeIds) {
    client.authorizedTransportTypeIds = input.authorizedTransportTypeIds;
  }
  return client;
}
