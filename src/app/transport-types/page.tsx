import { Truck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function TransportTypesPage() {
  return (
    <>
      <PageHeader
        title="Tipos de transporte"
        description="Cadastro dos tipos de transporte disponíveis"
      />
      <EmptyState
        icon={Truck}
        title="Tela em construção"
        description="O cadastro de tipos de transporte será implementado em uma próxima fase."
      />
    </>
  );
}
