import { faker } from "@faker-js/faker";
import type { Item } from "@/features/items/types";

const ITEM_COUNT = 18;
const UNITS = ["UN", "CX", "KG", "L", "PC"];

function generateItems(): Item[] {
  faker.seed(2002);

  return Array.from({ length: ITEM_COUNT }, (_, index) => ({
    id: `item-${index + 1}`,
    sku: `SKU-${String(index + 1).padStart(4, "0")}`,
    name: faker.commerce.productName(),
    unit: faker.helpers.arrayElement(UNITS),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
  }));
}

const items: Item[] = generateItems();

let nextId = items.length + 1;

export function listItems(search?: string): Item[] {
  if (!search) return items;
  const term = search.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(term) ||
      item.sku.toLowerCase().includes(term)
  );
}

export function getItemById(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

export function getItemBySku(sku: string): Item | undefined {
  return items.find((i) => i.sku.toLowerCase() === sku.toLowerCase());
}

export function createItem(input: {
  sku: string;
  name: string;
  unit: string;
}): Item {
  const item: Item = {
    id: `item-${nextId++}`,
    sku: input.sku,
    name: input.name,
    unit: input.unit,
    createdAt: new Date().toISOString(),
  };
  items.push(item);
  return item;
}
