"use client";

import { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useClientsList } from "@/features/clients/api";
import { useOrdersList } from "@/features/orders/api";
import { OrderStatusTimeline } from "@/features/orders/components/OrderStatusTimeline";
import { SchedulingConfirmDialog } from "@/features/orders/components/SchedulingConfirmDialog";
import { SchedulingFormDialog } from "@/features/orders/components/SchedulingFormDialog";
import type { SalesOrder } from "@/features/orders/types";
import { useTransportTypesList } from "@/features/transport-types/api";

const ELIGIBLE_STATUSES = ["PLANNED", "SCHEDULED"];

export default function SchedulingPage() {
  const { data: orders = [] } = useOrdersList({});
  const { data: clients = [] } = useClientsList();
  const { data: transportTypes = [] } = useTransportTypesList();
  const [formOrder, setFormOrder] = useState<SalesOrder | undefined>();
  const [confirmOrder, setConfirmOrder] = useState<SalesOrder | undefined>();

  const eligibleOrders = useMemo(
    () => orders.filter((order) => ELIGIBLE_STATUSES.includes(order.status)),
    [orders]
  );

  const clientNameById = useMemo(
    () => new Map(clients.map((c) => [c.id, c.name])),
    [clients]
  );
  const transportTypeNameById = useMemo(
    () => new Map(transportTypes.map((t) => [t.id, t.name])),
    [transportTypes]
  );

  const columns = useMemo<ColumnDef<SalesOrder, unknown>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      {
        id: "client",
        header: "Cliente",
        cell: ({ row }) => clientNameById.get(row.original.clientId) ?? "-",
      },
      {
        id: "transportType",
        header: "Transporte",
        cell: ({ row }) =>
          transportTypeNameById.get(row.original.transportTypeId) ?? "-",
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => (
          <OrderStatusTimeline status={row.original.status} compact />
        ),
      },
      {
        id: "scheduling",
        header: "Agendamento",
        cell: ({ row }) => {
          const scheduling = row.original.scheduling;
          if (!scheduling) return "Não definido";
          return `${new Date(scheduling.deliveryDate).toLocaleDateString("pt-BR")} · ${scheduling.windowStart}–${scheduling.windowEnd}`;
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFormOrder(row.original)}
            >
              {row.original.scheduling ? "Reagendar" : "Definir agendamento"}
            </Button>
            {row.original.scheduling && !row.original.scheduling.confirmed && (
              <Button size="sm" onClick={() => setConfirmOrder(row.original)}>
                Confirmar
              </Button>
            )}
          </div>
        ),
      },
    ],
    [clientNameById, transportTypeNameById]
  );

  return (
    <>
      <PageHeader
        title="Agendamento"
        description="Defina e confirme datas de entrega das ordens"
      />
      <DataTable
        columns={columns}
        data={eligibleOrders}
        emptyState={
          <EmptyState
            icon={CalendarClock}
            title="Nenhuma ordem elegível para agendamento"
            description="Ordens planejadas ou já agendadas aparecerão aqui."
          />
        }
      />
      {formOrder && (
        <SchedulingFormDialog
          open={Boolean(formOrder)}
          onOpenChange={(open) => !open && setFormOrder(undefined)}
          order={formOrder}
        />
      )}
      {confirmOrder && (
        <SchedulingConfirmDialog
          open={Boolean(confirmOrder)}
          onOpenChange={(open) => !open && setConfirmOrder(undefined)}
          order={confirmOrder}
        />
      )}
    </>
  );
}
