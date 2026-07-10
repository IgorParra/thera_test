"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useClientsList } from "@/features/clients/api";
import { ClientFormDialog } from "@/features/clients/components/ClientFormDialog";
import type { Client } from "@/features/clients/types";
import { useTransportTypesList } from "@/features/transport-types/api";

export default function ClientsPage() {
  const { data: clients = [] } = useClientsList();
  const { data: transportTypes = [] } = useTransportTypesList();
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();

  const transportTypeNameById = useMemo(
    () => new Map(transportTypes.map((t) => [t.id, t.name])),
    [transportTypes]
  );

  const columns = useMemo<ColumnDef<Client, unknown>[]>(
    () => [
      { accessorKey: "name", header: "Nome" },
      { accessorKey: "document", header: "Documento" },
      {
        id: "authorizedTransportTypes",
        header: "Transportes autorizados",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.authorizedTransportTypeIds.map((id) => (
              <Badge key={id} variant="outline">
                {transportTypeNameById.get(id) ?? id}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingClient(row.original);
              setFormOpen(true);
            }}
          >
            Editar
          </Button>
        ),
      },
    ],
    [transportTypeNameById]
  );

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Cadastro de clientes e transportes autorizados"
        actions={
          <Button
            onClick={() => {
              setEditingClient(undefined);
              setFormOpen(true);
            }}
          >
            Novo cliente
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={clients}
        emptyState={
          <EmptyState
            icon={Users}
            title="Nenhum cliente cadastrado"
            description="Crie o primeiro cliente para começar."
          />
        }
      />
      <ClientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        client={editingClient}
      />
    </>
  );
}
