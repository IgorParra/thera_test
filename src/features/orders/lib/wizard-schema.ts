import { z } from "zod";

export const clientStepSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
});

export const transportStepSchema = z.object({
  transportTypeId: z.string().min(1, "Selecione um tipo de transporte"),
});

export const itemsStepSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.number().min(1, "Quantidade deve ser maior que zero"),
      })
    )
    .min(1, "Adicione ao menos um item"),
});
