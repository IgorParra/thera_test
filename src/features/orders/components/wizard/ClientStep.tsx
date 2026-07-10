"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientsList } from "@/features/clients/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateWizardData } from "@/lib/redux/slices/order-wizard-slice";

export function ClientStep({ error }: { error?: string }) {
  const dispatch = useAppDispatch();
  const clientId = useAppSelector((state) => state.orderWizard.data.clientId);
  const { data: clients = [] } = useClientsList();

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">Cliente</span>
      <Select
        value={clientId ?? ""}
        onValueChange={(value) =>
          dispatch(
            updateWizardData({
              clientId: value ?? undefined,
              transportTypeId: undefined,
            })
          )
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um cliente" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
