"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetOrderScheduling } from "../api";
import type { SalesOrder } from "../types";

export function SchedulingFormDialog({
  open,
  onOpenChange,
  order,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: SalesOrder;
}) {
  const isRescheduling = Boolean(order.scheduling);
  const setScheduling = useSetOrderScheduling();
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(() =>
    order.scheduling ? new Date(order.scheduling.deliveryDate) : undefined
  );
  const [windowStart, setWindowStart] = useState(
    () => order.scheduling?.windowStart ?? ""
  );
  const [windowEnd, setWindowEnd] = useState(
    () => order.scheduling?.windowEnd ?? ""
  );

  function handleSubmit() {
    if (!deliveryDate || !windowStart || !windowEnd) {
      toast.error("Preencha a data e a janela de atendimento");
      return;
    }

    setScheduling
      .mutateAsync({
        id: order.id,
        deliveryDate: deliveryDate.toISOString(),
        windowStart,
        windowEnd,
      })
      .then(() => {
        toast.success(
          isRescheduling
            ? "Ordem reagendada com sucesso"
            : "Agendamento definido com sucesso"
        );
        onOpenChange(false);
      })
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Erro ao salvar agendamento"
        );
      });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isRescheduling ? "Reagendar entrega" : "Definir agendamento"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Calendar
            mode="single"
            selected={deliveryDate}
            onSelect={setDeliveryDate}
            className="mx-auto"
          />
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="window-start">Início da janela</Label>
              <Input
                id="window-start"
                type="time"
                value={windowStart}
                onChange={(e) => setWindowStart(e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="window-end">Fim da janela</Label>
              <Input
                id="window-end"
                type="time"
                value={windowEnd}
                onChange={(e) => setWindowEnd(e.target.value)}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={setScheduling.isPending}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
