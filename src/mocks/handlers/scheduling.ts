import { http, HttpResponse } from "msw";
import { canTransition } from "@/features/orders/lib/status-machine";
import { getOrderById, saveOrder } from "../fixtures/orders";
import { addAuditEvent } from "../fixtures/audit";

export const schedulingHandlers = [
  http.post("/api/orders/:id/scheduling", async ({ request, params }) => {
    const order = getOrderById(params.id as string);
    if (!order) {
      return HttpResponse.json(
        { error: "Ordem não encontrada" },
        { status: 404 }
      );
    }
    const body = (await request.json()) as {
      deliveryDate?: string;
      windowStart?: string;
      windowEnd?: string;
    };
    if (!body.deliveryDate || !body.windowStart || !body.windowEnd) {
      return HttpResponse.json(
        {
          error: "deliveryDate, windowStart e windowEnd são obrigatórios",
        },
        { status: 400 }
      );
    }

    const previousScheduling = order.scheduling
      ? { ...order.scheduling }
      : undefined;

    order.scheduling = {
      deliveryDate: body.deliveryDate,
      windowStart: body.windowStart,
      windowEnd: body.windowEnd,
      confirmed: false,
    };
    order.updatedAt = new Date().toISOString();
    saveOrder(order);

    addAuditEvent({
      entityType: "order",
      entityId: order.id,
      action: "SCHEDULING_SET",
      previousState: previousScheduling && { scheduling: previousScheduling },
      nextState: { scheduling: order.scheduling },
    });

    return HttpResponse.json(order);
  }),

  http.patch(
    "/api/orders/:id/scheduling/confirm",
    async ({ request, params }) => {
      const order = getOrderById(params.id as string);
      if (!order) {
        return HttpResponse.json(
          { error: "Ordem não encontrada" },
          { status: 404 }
        );
      }
      if (!order.scheduling) {
        return HttpResponse.json(
          { error: "Ordem ainda não possui agendamento" },
          { status: 400 }
        );
      }

      const body = (await request.json().catch(() => ({}))) as {
        transitionToScheduled?: boolean;
      };

      order.scheduling.confirmed = true;

      let statusTransitioned = false;
      if (
        body.transitionToScheduled &&
        canTransition(order.status, "SCHEDULED")
      ) {
        const previousStatus = order.status;
        order.status = "SCHEDULED";
        statusTransitioned = true;
        addAuditEvent({
          entityType: "order",
          entityId: order.id,
          action: "STATUS_CHANGED",
          previousState: { status: previousStatus },
          nextState: { status: order.status },
        });
      }

      order.updatedAt = new Date().toISOString();
      saveOrder(order);

      addAuditEvent({
        entityType: "order",
        entityId: order.id,
        action: "SCHEDULING_CONFIRMED",
        nextState: { scheduling: order.scheduling },
      });

      return HttpResponse.json({ order, statusTransitioned });
    }
  ),
];
