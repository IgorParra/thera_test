"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { History } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuditList } from "@/features/audit/api";
import { describeAuditEvent } from "@/features/audit/lib/labels";
import type { AuditEvent } from "@/features/audit/types";
import { ROUTES } from "@/lib/routes";

const ALL = "__all__";

export default function AuditPage() {
  const { data: events = [] } = useAuditList();
  const [entityType, setEntityType] = useState(ALL);

  const entityTypes = useMemo(
    () => Array.from(new Set(events.map((event) => event.entityType))),
    [events]
  );

  const filteredEvents = useMemo(
    () =>
      entityType === ALL
        ? events
        : events.filter((event) => event.entityType === entityType),
    [events, entityType]
  );

  const columns = useMemo<ColumnDef<AuditEvent, unknown>[]>(
    () => [
      {
        id: "occurredAt",
        header: "Data/hora",
        cell: ({ row }) =>
          new Date(row.original.occurredAt).toLocaleString("pt-BR"),
      },
      { accessorKey: "entityType", header: "Entidade" },
      {
        id: "entityId",
        header: "ID",
        cell: ({ row }) =>
          row.original.entityType === "order" ? (
            <Link
              href={`${ROUTES.ordens}/${row.original.entityId}`}
              className="underline underline-offset-2"
            >
              {row.original.entityId}
            </Link>
          ) : (
            row.original.entityId
          ),
      },
      {
        id: "action",
        header: "Ação",
        cell: ({ row }) => describeAuditEvent(row.original).label,
      },
      {
        id: "transition",
        header: "Anterior → Posterior",
        cell: ({ row }) => describeAuditEvent(row.original).transition ?? "-",
      },
    ],
    []
  );

  return (
    <>
      <PageHeader
        title="Auditoria"
        description="Histórico de eventos das ordens de venda"
      />

      <div className="flex flex-col gap-1.5 pb-4">
        <span className="text-sm text-muted-foreground">
          Tipo de entidade
        </span>
        <Select
          value={entityType}
          onValueChange={(value) => setEntityType(value ?? ALL)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {entityTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredEvents}
        emptyState={
          <EmptyState
            icon={History}
            title="Nenhum evento de auditoria"
            description="Eventos aparecerão aqui conforme as ordens forem criadas e atualizadas."
          />
        }
      />
    </>
  );
}
