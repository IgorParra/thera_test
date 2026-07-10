export type SalesOrderStatus =
  | "CREATED"
  | "PLANNED"
  | "SCHEDULED"
  | "IN_TRANSIT"
  | "DELIVERED";

export interface SalesOrderItem {
  itemId: string;
  quantity: number;
}

export interface Scheduling {
  deliveryDate: string;
  windowStart: string;
  windowEnd: string;
  confirmed: boolean;
}

export interface SalesOrder {
  id: string;
  clientId: string;
  transportTypeId: string;
  items: SalesOrderItem[];
  status: SalesOrderStatus;
  scheduling?: Scheduling;
  createdAt: string;
  updatedAt: string;
}
