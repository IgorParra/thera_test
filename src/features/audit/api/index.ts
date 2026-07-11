import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/http";
import type { AuditEvent } from "../types";

export interface AuditListFilters {
  entityType?: string;
  entityId?: string;
}

export const auditKeys = {
  all: ["audit"] as const,
  list: (filters: AuditListFilters = {}) =>
    [...auditKeys.all, "list", filters] as const,
};

function buildAuditQueryString(filters: AuditListFilters): string {
  const params = new URLSearchParams();
  if (filters.entityType) params.set("entityType", filters.entityType);
  if (filters.entityId) params.set("entityId", filters.entityId);
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function auditListOptions(filters: AuditListFilters = {}) {
  return queryOptions({
    queryKey: auditKeys.list(filters),
    queryFn: () =>
      apiFetch<AuditEvent[]>(`/api/audit${buildAuditQueryString(filters)}`),
  });
}

export function useAuditList(filters: AuditListFilters = {}) {
  return useQuery(auditListOptions(filters));
}
