import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { apiFetch } from "@/lib/http";
import type { TransportType } from "../types";

export const transportTypeKeys = {
  all: ["transport-types"] as const,
  list: () => [...transportTypeKeys.all, "list"] as const,
};

export const transportTypesListOptions = queryOptions({
  queryKey: transportTypeKeys.list(),
  queryFn: () => apiFetch<TransportType[]>("/api/transport-types"),
});

export function useTransportTypesList() {
  return useQuery(transportTypesListOptions);
}

export function useTransportTypeDetail(id: string) {
  return useQuery({
    ...transportTypesListOptions,
    select: (transportTypes) =>
      transportTypes.find((transportType) => transportType.id === id),
  });
}

export interface TransportTypeInput {
  name: string;
  code: string;
}

export function useCreateTransportType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransportTypeInput) =>
      apiFetch<TransportType>("/api/transport-types", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportTypeKeys.list() });
    },
  });
}

export function useUpdateTransportType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...input }: TransportTypeInput & { id: string }) =>
      apiFetch<TransportType>(`/api/transport-types/${id}`, {
        method: "PUT",
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportTypeKeys.list() });
    },
  });
}
