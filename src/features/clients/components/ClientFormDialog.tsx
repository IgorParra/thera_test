"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransportTypesList } from "@/features/transport-types/api";
import { useCreateClient, useUpdateClient } from "../api";
import { clientFormSchema, type ClientFormValues } from "../lib/schema";
import type { Client } from "../types";

const emptyValues: ClientFormValues = {
  name: "",
  document: "",
  authorizedTransportTypeIds: [],
};

export function ClientFormDialog({
  open,
  onOpenChange,
  client,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
}) {
  const isEditing = Boolean(client);
  const { data: transportTypes = [] } = useTransportTypesList();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (open) {
      reset(
        client
          ? {
              name: client.name,
              document: client.document,
              authorizedTransportTypeIds: client.authorizedTransportTypeIds,
            }
          : emptyValues
      );
    }
  }, [open, client, reset]);

  const isPending = createClient.isPending || updateClient.isPending;

  const onSubmit = handleSubmit((values) => {
    const mutation = isEditing
      ? updateClient.mutateAsync({ id: client!.id, ...values })
      : createClient.mutateAsync(values);

    mutation
      .then(() => {
        toast.success(
          isEditing ? "Cliente atualizado com sucesso" : "Cliente criado com sucesso"
        );
        onOpenChange(false);
      })
      .catch((error: unknown) => {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar cliente");
      });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar cliente" : "Novo cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="client-name">Nome</Label>
            <Input id="client-name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="client-document">Documento</Label>
            <Input id="client-document" {...register("document")} />
            {errors.document && (
              <p className="text-sm text-destructive">{errors.document.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Transportes autorizados</Label>
            <Controller
              control={control}
              name="authorizedTransportTypeIds"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  {transportTypes.map((transportType) => {
                    const checked = field.value.includes(transportType.id);
                    return (
                      <Label
                        key={transportType.id}
                        className="font-normal"
                        htmlFor={`transport-type-${transportType.id}`}
                      >
                        <Checkbox
                          id={`transport-type-${transportType.id}`}
                          checked={checked}
                          onCheckedChange={(value) => {
                            field.onChange(
                              value
                                ? [...field.value, transportType.id]
                                : field.value.filter((id) => id !== transportType.id)
                            );
                          }}
                        />
                        {transportType.name}
                      </Label>
                    );
                  })}
                </div>
              )}
            />
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
