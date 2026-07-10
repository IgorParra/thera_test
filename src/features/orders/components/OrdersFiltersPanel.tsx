"use client";

import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientsList } from "@/features/clients/api";
import { useTransportTypesList } from "@/features/transport-types/api";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  resetFilters,
  setClientId,
  setDateRange,
  setStatus,
  setTransportTypeId,
} from "@/lib/redux/slices/orders-filter-slice";
import { SALES_ORDER_STATUS_LABELS } from "../lib/status-labels";
import type { SalesOrderStatus } from "../types";

const ALL = "__all__";

export function OrdersFiltersPanel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.ordersFilter);
  const { data: clients = [] } = useClientsList();
  const { data: transportTypes = [] } = useTransportTypesList();

  const dateRangeValue =
    filters.dateRange.from || filters.dateRange.to
      ? {
          from: filters.dateRange.from
            ? new Date(filters.dateRange.from)
            : undefined,
          to: filters.dateRange.to ? new Date(filters.dateRange.to) : undefined,
        }
      : undefined;

  return (
    <div className="flex flex-wrap items-end gap-3 pb-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-muted-foreground">Status</span>
        <Select
          value={filters.status ?? ALL}
          onValueChange={(value) =>
            dispatch(setStatus(value === ALL ? null : (value as SalesOrderStatus)))
          }
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {Object.entries(SALES_ORDER_STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-muted-foreground">Cliente</span>
        <Select
          value={filters.clientId ?? ALL}
          onValueChange={(value) =>
            dispatch(setClientId(value === ALL ? null : value))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-muted-foreground">Transporte</span>
        <Select
          value={filters.transportTypeId ?? ALL}
          onValueChange={(value) =>
            dispatch(setTransportTypeId(value === ALL ? null : value))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Todos</SelectItem>
            {transportTypes.map((transportType) => (
              <SelectItem key={transportType.id} value={transportType.id}>
                {transportType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-muted-foreground">Período</span>
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="outline" className="w-56 justify-start">
                <CalendarIcon />
                {filters.dateRange.from || filters.dateRange.to
                  ? `${filters.dateRange.from ?? "..."} até ${filters.dateRange.to ?? "..."}`
                  : "Selecione o período"}
              </Button>
            }
          />
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRangeValue}
              onSelect={(range) =>
                dispatch(
                  setDateRange({
                    from: range?.from ? range.from.toISOString() : null,
                    to: range?.to ? range.to.toISOString() : null,
                  })
                )
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button variant="ghost" onClick={() => dispatch(resetFilters())}>
        Limpar filtros
      </Button>
    </div>
  );
}
