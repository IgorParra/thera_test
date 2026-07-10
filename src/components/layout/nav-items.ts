export interface NavItem {
  href: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/orders", label: "Ordens" },
  { href: "/scheduling", label: "Agendamento" },
  { href: "/clients", label: "Clientes" },
  { href: "/transport-types", label: "Tipos de Transporte" },
  { href: "/items", label: "Itens" },
  { href: "/audit", label: "Auditoria" },
];
