"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Label } from "@/components/ui/label";
import { useConfirmOrderScheduling } from "../api";
import type { SalesOrder } from "../types";

export function SchedulingConfirmDialog({
  open,
  onOpenChange,
  order,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: SalesOrder;
}) {
  const confirmScheduling = useConfirmOrderScheduling();
  const [transitionToScheduled, setTransitionToScheduled] = useState(false);
  const scheduling = order.scheduling;

  if (!scheduling) return null;

  const description = `Entrega em ${new Date(
    scheduling.deliveryDate
  ).toLocaleDateString("pt-BR")}, das ${scheduling.windowStart} às ${scheduling.windowEnd}.`;

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Confirmar agendamento"
      description={description}
      confirmLabel="Confirmar"
      onConfirm={() => {
        confirmScheduling
          .mutateAsync({ id: order.id, transitionToScheduled })
          .then(() => {
            toast.success("Agendamento confirmado com sucesso");
          })
          .catch((error: unknown) => {
            toast.error(
              error instanceof Error
                ? error.message
                : "Erro ao confirmar agendamento"
            );
          });
      }}
    >
      {order.status === "PLANNED" && (
        <Label className="font-normal" htmlFor="transition-to-scheduled">
          <Checkbox
            id="transition-to-scheduled"
            checked={transitionToScheduled}
            onCheckedChange={(checked) => setTransitionToScheduled(checked)}
          />
          Também marcar ordem como Agendada
        </Label>
      )}
    </ConfirmDialog>
  );
}
