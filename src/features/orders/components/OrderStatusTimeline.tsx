import { cn } from "@/lib/utils";
import { SALES_ORDER_STATUS_SEQUENCE } from "../lib/status-machine";
import { SALES_ORDER_STATUS_LABELS } from "../lib/status-labels";
import type { SalesOrderStatus } from "../types";

export function OrderStatusTimeline({
  status,
  compact = false,
}: {
  status: SalesOrderStatus;
  compact?: boolean;
}) {
  const currentIndex = SALES_ORDER_STATUS_SEQUENCE.indexOf(status);
  const lastIndex = SALES_ORDER_STATUS_SEQUENCE.length - 1;
  const progressPercent = (currentIndex / lastIndex) * 100;
  const dotSize = compact ? "size-2" : "size-3";
  const lineTop = compact ? "top-1" : "top-1.5";

  return (
    <div
      className={cn(
        "relative flex items-start justify-between",
        compact ? "min-w-24" : "min-w-80"
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 h-px bg-muted-foreground/30",
          lineTop
        )}
      />
      <div
        className={cn("absolute left-0 h-px bg-primary", lineTop)}
        style={{ width: `${progressPercent}%` }}
      />
      {SALES_ORDER_STATUS_SEQUENCE.map((step, index) => {
        const isReached = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div
            key={step}
            className="relative z-10 flex flex-col items-center gap-1"
          >
            <span
              className={cn(
                "rounded-full",
                dotSize,
                isReached ? "bg-primary" : "bg-background ring-2 ring-muted-foreground/30"
              )}
            />
            {!compact && (
              <span
                className={cn(
                  "text-xs whitespace-nowrap",
                  isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {SALES_ORDER_STATUS_LABELS[step]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
