"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCreateOrder } from "@/features/orders/api";
import { ClientStep } from "@/features/orders/components/wizard/ClientStep";
import { ItemsStep } from "@/features/orders/components/wizard/ItemsStep";
import { TransportStep } from "@/features/orders/components/wizard/TransportStep";
import {
  clientStepSchema,
  itemsStepSchema,
  transportStepSchema,
} from "@/features/orders/lib/wizard-schema";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  nextStep,
  prevStep,
  resetWizard,
} from "@/lib/redux/slices/order-wizard-slice";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Cliente", schema: clientStepSchema },
  { label: "Transporte", schema: transportStepSchema },
  { label: "Itens", schema: itemsStepSchema },
];

export default function NewOrderPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { step, data } = useAppSelector((state) => state.orderWizard);
  const createOrder = useCreateOrder();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    dispatch(resetWizard());
  }, [dispatch]);

  function validateCurrentStep(): boolean {
    const result = STEPS[step].schema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0]?.message);
      return false;
    }
    setError(undefined);
    return true;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    dispatch(nextStep());
  }

  function handleBack() {
    setError(undefined);
    dispatch(prevStep());
  }

  function handleSubmit() {
    if (!validateCurrentStep()) return;
    const parsed = itemsStepSchema.safeParse(data);
    if (!parsed.success) return;

    createOrder
      .mutateAsync({
        clientId: data.clientId!,
        transportTypeId: data.transportTypeId!,
        items: parsed.data.items,
      })
      .then((order) => {
        toast.success("Ordem criada com sucesso");
        dispatch(resetWizard());
        router.push(`${ROUTES.ordens}/${order.id}`);
      })
      .catch((err: unknown) => {
        toast.error(err instanceof Error ? err.message : "Erro ao criar ordem");
      });
  }

  return (
    <>
      <PageHeader
        title="Nova ordem de venda"
        description="Preencha os passos abaixo para criar uma nova ordem"
      />

      <div className="mb-6 flex items-center gap-4">
        {STEPS.map((s, index) => (
          <div key={s.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-medium",
                index === step
                  ? "bg-primary text-primary-foreground"
                  : index < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                index === step ? "font-medium text-foreground" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="mx-2 h-px w-8 bg-border" />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-lg">
        {step === 0 && <ClientStep error={error} />}
        {step === 1 && <TransportStep error={error} />}
        {step === 2 && <ItemsStep error={error} />}
      </div>

      <div className="mt-6 flex gap-2">
        {step > 0 && (
          <Button type="button" variant="outline" onClick={handleBack}>
            Voltar
          </Button>
        )}
        {step < STEPS.length - 1 && (
          <Button type="button" onClick={handleNext}>
            Próximo
          </Button>
        )}
        {step === STEPS.length - 1 && (
          <Button type="button" onClick={handleSubmit} disabled={createOrder.isPending}>
            Criar ordem
          </Button>
        )}
      </div>
    </>
  );
}
