import { faker } from "@faker-js/faker";
import type {
  SalesOrder,
  SalesOrderItem,
  SalesOrderStatus,
  Scheduling,
} from "@/features/orders/types";
import { listClients } from "./clients";
import { listItems } from "./items";

// Cycles through every status so the seed data exercises all 5 states,
// weighted toward the earlier ones the way a real backlog would look.
const STATUS_SEQUENCE: SalesOrderStatus[] = [
  "CREATED",
  "CREATED",
  "PLANNED",
  "PLANNED",
  "PLANNED",
  "SCHEDULED",
  "SCHEDULED",
  "SCHEDULED",
  "IN_TRANSIT",
  "IN_TRANSIT",
  "DELIVERED",
  "DELIVERED",
];

function randomItems(): SalesOrderItem[] {
  const items = listItems();
  const picked = faker.helpers.arrayElements(items, { min: 1, max: 4 });
  return picked.map((item) => ({
    itemId: item.id,
    quantity: faker.number.int({ min: 1, max: 10 }),
  }));
}

function buildScheduling(confirmed: boolean): Scheduling {
  const deliveryDate = faker.date.soon({ days: 14 });
  return {
    deliveryDate: deliveryDate.toISOString(),
    windowStart: "08:00",
    windowEnd: "12:00",
    confirmed,
  };
}

function generateOrders(): SalesOrder[] {
  faker.seed(3003);
  const clients = listClients();

  return STATUS_SEQUENCE.map((status, index) => {
    const client = faker.helpers.arrayElement(clients);
    const transportTypeId = faker.helpers.arrayElement(
      client.authorizedTransportTypeIds
    );
    const createdAt = faker.date.past({ years: 1 }).toISOString();

    // Orders at SCHEDULED+ have a confirmed schedule; one PLANNED order
    // also gets an unconfirmed one to represent a pending reschedule.
    let scheduling: Scheduling | undefined;
    if (["SCHEDULED", "IN_TRANSIT", "DELIVERED"].includes(status)) {
      scheduling = buildScheduling(true);
    } else if (status === "PLANNED" && index === 4) {
      scheduling = buildScheduling(false);
    }

    const order: SalesOrder = {
      id: `order-${index + 1}`,
      clientId: client.id,
      transportTypeId,
      items: randomItems(),
      status,
      scheduling,
      createdAt,
      updatedAt: createdAt,
    };
    return order;
  });
}

const orders: SalesOrder[] = generateOrders();

let nextId = orders.length + 1;

export function listOrders(): SalesOrder[] {
  return orders;
}

export function getOrderById(id: string): SalesOrder | undefined {
  return orders.find((o) => o.id === id);
}

export function createOrder(
  input: Omit<SalesOrder, "id" | "createdAt" | "updatedAt" | "status">
): SalesOrder {
  const now = new Date().toISOString();
  const order: SalesOrder = {
    ...input,
    id: `order-${nextId++}`,
    status: "CREATED",
    createdAt: now,
    updatedAt: now,
  };
  orders.push(order);
  return order;
}

export function saveOrder(updated: SalesOrder): void {
  const index = orders.findIndex((o) => o.id === updated.id);
  if (index === -1) return;
  orders[index] = updated;
}
