import { History } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AuditPage() {
  return (
    <>
      <PageHeader
        title="Auditoria"
        description="Histórico de eventos das ordens de venda"
      />
      <EmptyState
        icon={History}
        title="Tela em construção"
        description="O histórico de auditoria será implementado em uma próxima fase."
      />
    </>
  );
}
