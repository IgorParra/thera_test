import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiFetch } from "@/lib/http";
import type { Client } from "../types";

export const clientKeys = {
  all: ["clients"] as const,
  list: () => [...clientKeys.all, "list"] as const,
};

const clientsListOptions = queryOptions({
  queryKey: clientKeys.list(),
  queryFn: () => apiFetch<Client[]>("/api/clients"),
});

export function useClientsList() {
  return useQuery(clientsListOptions);
}

export function useClientDetail(id: string) {
  return useQuery({
    ...clientsListOptions,
    select: (clients) => clients.find((client) => client.id === id),
  });
}

export interface ClientInput {
  name: string;
  document: string;
  authorizedTransportTypeIds?: string[];
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ClientInput) =>
      apiFetch<Client>("/api/clients", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.list() });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: ClientInput & { id: string }) =>
      apiFetch<Client>(`/api/clients/${id}`, {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.list() });
    },
  });
}
