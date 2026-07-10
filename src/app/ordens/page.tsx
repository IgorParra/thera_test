"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { buttonVariants } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useClientsList } from "@/features/clients/api";
import { useOrdersList, type OrdersListFilters } from "@/features/orders/api";
import { OrderStatusTimeline } from "@/features/orders/components/OrderStatusTimeline";
import { OrdersFiltersPanel } from "@/features/orders/components/OrdersFiltersPanel";
import type { SalesOrder } from "@/features/orders/types";
import { useTransportTypesList } from "@/features/transport-types/api";
import { useAppSelector } from "@/lib/redux/hooks";
import type { OrdersFilterState } from "@/lib/redux/slices/orders-filter-slice";
import { ROUTES } from "@/lib/routes";

function toQueryFilters(filters: OrdersFilterState): OrdersListFilters {
  return {
    status: filters.status ?? undefined,
    clientId: filters.clientId ?? undefined,
    transportTypeId: filters.transportTypeId ?? undefined,
    dateFrom: filters.dateRange.from ?? undefined,
    dateTo: filters.dateRange.to ?? undefined,
  };
}

export default function OrdersPage() {
  const filterState = useAppSelector((state) => state.ordersFilter);
  const queryFilters = useMemo(() => toQueryFilters(filterState), [filterState]);
  const { data: orders = [] } = useOrdersList(queryFilters);
  const { data: clients = [] } = useClientsList();
  const { data: transportTypes = [] } = useTransportTypesList();

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
        id: "createdAt",
        header: "Data",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString("pt-BR"),
      },
      {
        id: "itemsCount",
        header: "Itens",
        cell: ({ row }) => row.original.items.length,
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <Link
            href={`${ROUTES.ordens}/${row.original.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Ver detalhes
          </Link>
        ),
      },
    ],
    [clientNameById, transportTypeNameById]
  );

  return (
    <>
      <PageHeader
        title="Ordens de venda"
        description="Acompanhe e gerencie as ordens de venda"
        actions={
          <Link
            href={`${ROUTES.ordens}/nova`}
            className={buttonVariants({ variant: "default" })}
          >
            Nova ordem
          </Link>
        }
      />
      <OrdersFiltersPanel />
      <DataTable
        columns={columns}
        data={orders}
        emptyState={
          <EmptyState
            icon={ClipboardList}
            title="Nenhuma ordem encontrada"
            description="Ajuste os filtros ou crie uma nova ordem de venda."
          />
        }
      />
    </>
  );
}
