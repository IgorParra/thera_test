import { z } from "zod";
import { ITEM_UNITS } from "./constants";

export const itemFormSchema = z.object({
  sku: z.string().trim().min(1, "SKU é obrigatório"),
  name: z.string().trim().min(1, "Nome é obrigatório"),
  unit: z.enum(ITEM_UNITS, { message: "Unidade é obrigatória" }),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
