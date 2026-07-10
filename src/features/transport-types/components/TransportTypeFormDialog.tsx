"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTransportType, useUpdateTransportType } from "../api";
import {
  transportTypeFormSchema,
  type TransportTypeFormValues,
} from "../lib/schema";
import type { TransportType } from "../types";

const emptyValues: TransportTypeFormValues = { name: "", code: "" };

export function TransportTypeFormDialog({
  open,
  onOpenChange,
  transportType,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transportType?: TransportType;
}) {
  const isEditing = Boolean(transportType);
  const createTransportType = useCreateTransportType();
  const updateTransportType = useUpdateTransportType();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransportTypeFormValues>({
    resolver: zodResolver(transportTypeFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        transportType
          ? { name: transportType.name, code: transportType.code }
          : emptyValues
      );
    }
  }, [open, transportType, reset]);

  const isPending = createTransportType.isPending || updateTransportType.isPending;

  const onSubmit = handleSubmit((values) => {
    const mutation = isEditing
      ? updateTransportType.mutateAsync({ id: transportType!.id, ...values })
      : createTransportType.mutateAsync(values);

    mutation
      .then(() => {
        toast.success(
          isEditing
            ? "Tipo de transporte atualizado com sucesso"
            : "Tipo de transporte criado com sucesso"
        );
        onOpenChange(false);
      })
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Erro ao salvar tipo de transporte"
        );
      });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar tipo de transporte" : "Novo tipo de transporte"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transport-type-name">Nome</Label>
            <Input id="transport-type-name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="transport-type-code">Código</Label>
            <Input id="transport-type-code" {...register("code")} />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
