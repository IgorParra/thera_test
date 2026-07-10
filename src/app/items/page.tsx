import { Package } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ItemsPage() {
  return (
    <>
      <PageHeader
        title="Itens"
        description="Cadastro de itens e produtos"
      />
      <EmptyState
        icon={Package}
        title="Tela em construção"
        description="O cadastro de itens será implementado em uma próxima fase."
      />
    </>
  );
}
