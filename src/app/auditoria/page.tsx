import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { auditKeys } from "@/features/audit/api";
import { AuditPageClient } from "@/features/audit/components/AuditPageClient";
import { getQueryClient } from "@/lib/query-client";
import { listAudit } from "@/mocks/fixtures/audit";

export default async function AuditPage() {
  const queryClient = getQueryClient();

  queryClient.setQueryData(auditKeys.list({}), listAudit({}));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AuditPageClient />
    </HydrationBoundary>
  );
}
