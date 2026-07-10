"use client";

import { useMemo, useState } from "react";
import { Truck } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTransportTypesList } from "@/features/transport-types/api";
import { TransportTypeFormDialog } from "@/features/transport-types/components/TransportTypeFormDialog";
import type { TransportType } from "@/features/transport-types/types";

export default function TransportTypesPage() {
  const { data: transportTypes = [] } = useTransportTypesList();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransportType, setEditingTransportType] = useState<
    TransportType | undefined
  >();

  const columns = useMemo<ColumnDef<TransportType, unknown>[]>(
    () => [
      { accessorKey: "name", header: "Nome" },
      { accessorKey: "code", header: "Código" },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingTransportType(row.original);
              setFormOpen(true);
            }}
          >
            Editar
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <>
      <PageHeader
        title="Tipos de transporte"
        description="Cadastro dos tipos de transporte disponíveis"
        actions={
          <Button
            onClick={() => {
              setEditingTransportType(undefined);
              setFormOpen(true);
            }}
          >
            Novo tipo de transporte
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={transportTypes}
        emptyState={
          <EmptyState
            icon={Truck}
            title="Nenhum tipo de transporte cadastrado"
            description="Crie o primeiro tipo de transporte para começar."
          />
        }
      />
      <TransportTypeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        transportType={editingTransportType}
      />
    </>
  );
}
