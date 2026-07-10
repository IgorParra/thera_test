import { CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function SchedulingPage() {
  return (
    <>
      <PageHeader
        title="Agendamento"
        description="Defina e confirme datas de entrega das ordens"
      />
      <EmptyState
        icon={CalendarClock}
        title="Tela em construção"
        description="O agendamento de entregas será implementado em uma próxima fase."
      />
    </>
  );
}
