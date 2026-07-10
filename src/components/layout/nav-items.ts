export interface NavItem {
  href: string;
  label: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/orders", label: "Ordens" },
  { href: "/scheduling", label: "Agendamento" },
  { href: "/clientes", label: "Clientes" },
  { href: "/tipos-transporte", label: "Tipos de Transporte" },
  { href: "/itens", label: "Itens" },
  { href: "/audit", label: "Auditoria" },
];
