import { ROUTES } from "@/lib/routes";

export interface NavItem {
  href: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: ROUTES.ordens, label: "Ordens" },
  { href: ROUTES.agendamento, label: "Agendamento" },
  { href: ROUTES.clientes, label: "Clientes" },
  { href: ROUTES.tiposTransporte, label: "Tipos de Transporte" },
  { href: ROUTES.itens, label: "Itens" },
  { href: ROUTES.auditoria, label: "Auditoria" },
];
