"use client";

import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useItemsList } from "@/features/items/api";
import { ItemFormDialog } from "@/features/items/components/ItemFormDialog";
import type { Item } from "@/features/items/types";

export function ItemsPageClient() {
  const { data: items = [] } = useItemsList();
  const [formOpen, setFormOpen] = useState(false);

  const columns = useMemo<ColumnDef<Item, unknown>[]>(
    () => [
      { accessorKey: "sku", header: "SKU" },
      { accessorKey: "name", header: "Nome" },
      { accessorKey: "unit", header: "Unidade" },
    ],
    []
  );

  return (
    <>
      <PageHeader
        title="Itens"
        description="Cadastro de itens e produtos"
        actions={<Button onClick={() => setFormOpen(true)}>Novo item</Button>}
      />
      <DataTable
        columns={columns}
        data={items}
        emptyState={
          <EmptyState
            icon={Package}
            title="Nenhum item cadastrado"
            description="Crie o primeiro item para começar."
          />
        }
      />
      <ItemFormDialog open={formOpen} onOpenChange={setFormOpen} />
    </>
  );
}
