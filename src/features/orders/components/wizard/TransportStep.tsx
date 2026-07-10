"use client";

import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientsList } from "@/features/clients/api";
import { useTransportTypesList } from "@/features/transport-types/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateWizardData } from "@/lib/redux/slices/order-wizard-slice";

export function TransportStep({ error }: { error?: string }) {
  const dispatch = useAppDispatch();
  const wizardData = useAppSelector((state) => state.orderWizard.data);
  const { data: clients = [] } = useClientsList();
  const { data: transportTypes = [] } = useTransportTypesList();

  const authorizedTransportTypes = useMemo(() => {
    const client = clients.find((c) => c.id === wizardData.clientId);
    if (!client) return [];
    return transportTypes.filter((t) =>
      client.authorizedTransportTypeIds.includes(t.id)
    );
  }, [clients, transportTypes, wizardData.clientId]);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">Tipo de transporte</span>
      <Select
        value={wizardData.transportTypeId ?? ""}
        onValueChange={(value) =>
          dispatch(updateWizardData({ transportTypeId: value ?? undefined }))
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o tipo de transporte" />
        </SelectTrigger>
        <SelectContent>
          {authorizedTransportTypes.map((transportType) => (
            <SelectItem key={transportType.id} value={transportType.id}>
              {transportType.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {authorizedTransportTypes.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Este cliente não possui tipos de transporte autorizados.
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
