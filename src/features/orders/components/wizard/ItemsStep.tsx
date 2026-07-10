"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useItemsList } from "@/features/items/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateWizardData } from "@/lib/redux/slices/order-wizard-slice";

export function ItemsStep({ error }: { error?: string }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.orderWizard.data.items) ?? [];
  const [search, setSearch] = useState("");
  const { data: allItems = [] } = useItemsList();
  const { data: searchResults = [] } = useItemsList(search || undefined);

  const itemById = useMemo(
    () => new Map(allItems.map((item) => [item.id, item])),
    [allItems]
  );

  const selectedIds = new Set(items.map((item) => item.itemId));

  function addItem(itemId: string) {
    dispatch(
      updateWizardData({ items: [...items, { itemId, quantity: 1 }] })
    );
  }

  function removeItem(itemId: string) {
    dispatch(
      updateWizardData({ items: items.filter((i) => i.itemId !== itemId) })
    );
  }

  function setQuantity(itemId: string, quantity: number) {
    dispatch(
      updateWizardData({
        items: items.map((i) => (i.itemId === itemId ? { ...i, quantity } : i)),
      })
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Buscar item</span>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nome ou SKU"
        />
        {search && (
          <div className="flex flex-col gap-1 rounded-lg border border-border p-2">
            {searchResults.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum item encontrado.
              </p>
            )}
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span>
                  {item.sku} — {item.name}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={selectedIds.has(item.id)}
                  onClick={() => addItem(item.id)}
                >
                  {selectedIds.has(item.id) ? "Adicionado" : "Adicionar"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Itens da ordem</span>
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum item adicionado ainda.
          </p>
        )}
        {items.map((orderItem) => (
          <div
            key={orderItem.itemId}
            className="flex items-center justify-between gap-2 rounded-lg border border-border p-2"
          >
            <span className="text-sm">
              {itemById.get(orderItem.itemId)?.name ?? orderItem.itemId}
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                className="w-20"
                value={orderItem.quantity}
                onChange={(e) =>
                  setQuantity(orderItem.itemId, Number(e.target.value))
                }
              />
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => removeItem(orderItem.itemId)}
              >
                Remover
              </Button>
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
