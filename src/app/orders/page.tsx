import { ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        title="Ordens de venda"
        description="Acompanhe e gerencie as ordens de venda"
      />
      <EmptyState
        icon={ClipboardList}
        title="Tela em construção"
        description="A listagem de ordens de venda será implementada em uma próxima fase."
      />
    </>
  );
}
