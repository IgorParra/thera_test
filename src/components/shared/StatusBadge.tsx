import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SalesOrderStatus } from "@/features/orders/types";
import { SALES_ORDER_STATUS_LABELS } from "@/features/orders/lib/status-labels";

// SalesOrderStatus is an ordinal progression (CRIADA -> ... -> ENTREGUE), not a
// good/bad signal, so it gets a single-hue monotone ramp (one step per stage)
// instead of the good/warning/serious/critical status palette.
const STATUS_STYLES: Record<SalesOrderStatus, { dot: string; chip: string }> = {
  CREATED: {
    dot: "bg-[#86b6ef]",
    chip: "bg-[#eaf2f9] dark:bg-[#323c48]",
  },
  PLANNED: {
    dot: "bg-[#5598e7]",
    chip: "bg-[#e3edf8] dark:bg-[#273646]",
  },
  SCHEDULED: {
    dot: "bg-[#2a78d6]",
    chip: "bg-[#dde8f5] dark:bg-[#1e2f43]",
  },
  IN_TRANSIT: {
    dot: "bg-[#1c5cab]",
    chip: "bg-[#dae4ef] dark:bg-[#1a2939]",
  },
  DELIVERED: {
    dot: "bg-[#104281] dark:bg-[#184f95]",
    chip: "bg-[#d9e0e9] dark:bg-[#1a2634]",
  },
};

export function StatusBadge({ status }: { status: SalesOrderStatus }) {
  const styles = STATUS_STYLES[status];

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 border-transparent text-foreground", styles.chip)}
    >
      <span className={cn("size-1.5 rounded-full", styles.dot)} />
      {SALES_ORDER_STATUS_LABELS[status]}
    </Badge>
  );
}
