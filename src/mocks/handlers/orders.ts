import { http, HttpResponse } from "msw";
import type { SalesOrderItem, SalesOrderStatus } from "@/features/orders/types";
import { canTransition } from "@/features/orders/lib/status-machine";
import { getClientById } from "../fixtures/clients";
import { getItemById } from "../fixtures/items";
import { createOrder, getOrderById, listOrders, saveOrder } from "../fixtures/orders";
import { addAuditEvent } from "../fixtures/audit";
import { filterOrders } from "../lib/filter-orders";

export const orderHandlers = [
  http.get("/api/orders", ({ request }) => {
    const params = new URL(request.url).searchParams;
    const orders = filterOrders(listOrders(), {
      status: (params.get("status") as SalesOrderStatus) ?? undefined,
      clientId: params.get("clientId") ?? undefined,
      transportTypeId: params.get("transportTypeId") ?? undefined,
      dateFrom: params.get("dateFrom") ?? undefined,
      dateTo: params.get("dateTo") ?? undefined,
    });

    return HttpResponse.json(orders);
  }),

  http.get("/api/orders/:id", ({ params }) => {
    const order = getOrderById(params.id as string);
    if (!order) {
      return HttpResponse.json(
        { error: "Ordem não encontrada" },
        { status: 404 }
      );
    }
    return HttpResponse.json(order);
  }),

  http.post("/api/orders", async ({ request }) => {
    const body = (await request.json()) as {
      clientId?: string;
      transportTypeId?: string;
      items?: SalesOrderItem[];
    };

    if (!body.clientId) {
      return HttpResponse.json(
        { error: "clientId é obrigatório" },
        { status: 400 }
      );
    }
    const client = getClientById(body.clientId);
    if (!client) {
      return HttpResponse.json(
        { error: "Cliente não encontrado" },
        { status: 400 }
      );
    }
    if (
      !body.transportTypeId ||
      !client.authorizedTransportTypeIds.includes(body.transportTypeId)
    ) {
      return HttpResponse.json(
        { error: "Tipo de transporte não autorizado para este cliente" },
        { status: 400 }
      );
    }
    if (!body.items || body.items.length === 0) {
      return HttpResponse.json(
        { error: "A ordem precisa de ao menos um item" },
        { status: 400 }
      );
    }
    for (const orderItem of body.items) {
      if (!getItemById(orderItem.itemId)) {
        return HttpResponse.json(
          { error: `Item ${orderItem.itemId} não encontrado` },
          { status: 400 }
        );
      }
    }

    const order = createOrder({
      clientId: body.clientId,
      transportTypeId: body.transportTypeId,
      items: body.items,
    });
    addAuditEvent({
      entityType: "order",
      entityId: order.id,
      action: "CREATED",
      nextState: { ...order },
    });

    return HttpResponse.json(order, { status: 201 });
  }),

  http.patch("/api/orders/:id/status", async ({ request, params }) => {
    const order = getOrderById(params.id as string);
    if (!order) {
      return HttpResponse.json(
        { error: "Ordem não encontrada" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as { status?: SalesOrderStatus };
    if (!body.status || !canTransition(order.status, body.status)) {
      return HttpResponse.json(
        {
          error: `Transição de status inválida: ${order.status} -> ${body.status}`,
        },
        { status: 422 }
      );
    }

    const previousStatus = order.status;
    order.status = body.status;
    order.updatedAt = new Date().toISOString();
    saveOrder(order);

    addAuditEvent({
      entityType: "order",
      entityId: order.id,
      action: "STATUS_CHANGED",
      previousState: { status: previousStatus },
      nextState: { status: order.status },
    });

    return HttpResponse.json(order);
  }),
];
