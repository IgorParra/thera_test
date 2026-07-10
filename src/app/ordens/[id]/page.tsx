"use client";

import { use, useMemo } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { useClientsList } from "@/features/clients/api";
import { useItemsList } from "@/features/items/api";
import { useOrderDetail } from "@/features/orders/api";
import { OrderStatusTimeline } from "@/features/orders/components/OrderStatusTimeline";
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

  return (
    <>
      <PageHeader
        title={`Ordem ${order.id}`}
        description={`Cliente: ${clientNameById.get(order.clientId) ?? "-"} · Transporte: ${
          transportTypeNameById.get(order.transportTypeId) ?? "-"
        }`}
      />

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
    </>
  );
}
