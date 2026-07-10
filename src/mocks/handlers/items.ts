import { http, HttpResponse } from "msw";
import { createItem, getItemBySku, listItems } from "../fixtures/items";

export const itemHandlers = [
  http.get("/api/items", ({ request }) => {
    const search = new URL(request.url).searchParams.get("search");
    return HttpResponse.json(listItems(search ?? undefined));
  }),

  http.post("/api/items", async ({ request }) => {
    const body = (await request.json()) as {
      sku?: string;
      name?: string;
      unit?: string;
    };
    if (!body.sku || !body.name || !body.unit) {
      return HttpResponse.json(
        { error: "sku, name e unit são obrigatórios" },
        { status: 400 }
      );
    }
    if (getItemBySku(body.sku)) {
      return HttpResponse.json(
        { error: "Já existe um item com este SKU" },
        { status: 400 }
      );
    }
    const item = createItem({
      sku: body.sku,
      name: body.name,
      unit: body.unit,
    });
    return HttpResponse.json(item, { status: 201 });
  }),
];
