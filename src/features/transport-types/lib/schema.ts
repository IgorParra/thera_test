import { z } from "zod";

export const transportTypeFormSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  code: z.string().trim().min(1, "Código é obrigatório"),
});

export type TransportTypeFormValues = z.infer<typeof transportTypeFormSchema>;
