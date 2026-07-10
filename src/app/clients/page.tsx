import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        title="Clientes"
        description="Cadastro de clientes e transportes autorizados"
      />
      <EmptyState
        icon={Users}
        title="Tela em construção"
        description="O cadastro de clientes será implementado em uma próxima fase."
      />
    </>
  );
}
