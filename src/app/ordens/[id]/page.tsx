"use client";

import { use, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuditList } from "@/features/audit/api";
import { describeAuditEvent } from "@/features/audit/lib/labels";
import { useClientsList } from "@/features/clients/api";
import { useItemsList } from "@/features/items/api";
import { useOrderDetail, useUpdateOrderStatus } from "@/features/orders/api";
import { OrderStatusTimeline } from "@/features/orders/components/OrderStatusTimeline";
import { getValidNextStatuses } from "@/features/orders/lib/status-machine";
import { SALES_ORDER_STATUS_LABELS } from "@/features/orders/lib/status-labels";
import { useTransportTypesList } from "@/features/transport-types/api";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order } = useOrderDetail(id);
  const { data: clients = [] } = useClientsList();
  const { data: transportTypes = [] } = useTransportTypesList();
  const { data: items = [] } = useItemsList();
  const { data: auditEvents = [] } = useAuditList({
    entityType: "order",
    entityId: id,
  });
  const updateOrderStatus = useUpdateOrderStatus();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const clientNameById = useMemo(
    () => new Map(clients.map((c) => [c.id, c.name])),
    [clients]
  );
  const transportTypeNameById = useMemo(
    () => new Map(transportTypes.map((t) => [t.id, t.name])),
    [transportTypes]
  );
  const itemById = useMemo(
    () => new Map(items.map((item) => [item.id, item])),
    [items]
  );

  if (!order) {
    return (
      <>
        <PageHeader title="Ordem de venda" />
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </>
    );
  }

  const [nextStatus] = getValidNextStatuses(order.status);

  return (
    <>
      <PageHeader
        title={`Ordem ${order.id}`}
        description={`Cliente: ${clientNameById.get(order.clientId) ?? "-"} · Transporte: ${
          transportTypeNameById.get(order.transportTypeId) ?? "-"
        }`}
        actions={
          nextStatus && (
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={updateOrderStatus.isPending}
            >
              Avançar para {SALES_ORDER_STATUS_LABELS[nextStatus]}
            </Button>
          )
        }
      />

      {nextStatus && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Confirmar transição de status"
          description={`A ordem passará de "${SALES_ORDER_STATUS_LABELS[order.status]}" para "${SALES_ORDER_STATUS_LABELS[nextStatus]}".`}
          confirmLabel="Confirmar"
          onConfirm={() => {
            updateOrderStatus
              .mutateAsync({ id: order.id, status: nextStatus })
              .then(() => {
                toast.success("Status atualizado com sucesso");
              })
              .catch((error: unknown) => {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Erro ao atualizar status"
                );
              });
          }}
        />
      )}

      <div className="mb-6 overflow-x-auto py-4">
        <OrderStatusTimeline status={order.status} />
      </div>

      <div className="mb-6 flex flex-col gap-1 text-sm text-muted-foreground">
        <span>Criada em: {new Date(order.createdAt).toLocaleString("pt-BR")}</span>
        <span>
          Atualizada em: {new Date(order.updatedAt).toLocaleString("pt-BR")}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-sm font-semibold">Itens</h2>
        <div className="rounded-lg border border-border">
          {order.items.map((orderItem) => {
            const item = itemById.get(orderItem.itemId);
            return (
              <div
                key={orderItem.itemId}
                className="flex items-center justify-between gap-2 border-b border-border p-3 text-sm last:border-b-0"
              >
                <span>
                  {item ? `${item.sku} — ${item.name}` : orderItem.itemId}
                </span>
                <span className="text-muted-foreground">
                  Qtd: {orderItem.quantity}
                  {item ? ` ${item.unit}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <h2 className="font-heading text-sm font-semibold">
          Log de auditoria
        </h2>
        {auditEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum evento registrado ainda.
          </p>
        ) : (
          <div className="rounded-lg border border-border">
            {auditEvents.map((event) => {
              const { label, transition } = describeAuditEvent(event);
              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between gap-2 border-b border-border p-3 text-sm last:border-b-0"
                >
                  <span className="text-muted-foreground">
                    {new Date(event.occurredAt).toLocaleString("pt-BR")}
                  </span>
                  <span>{label}</span>
                  <span className="text-muted-foreground">{transition ?? "-"}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
