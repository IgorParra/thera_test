import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório"),
  document: z.string().trim().min(1, "Documento é obrigatório"),
  authorizedTransportTypeIds: z.array(z.string()),
});

export type ClientFormValues = z.infer<typeof clientFormSchema>;
