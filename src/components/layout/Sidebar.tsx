import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NavLinks } from "./NavLinks";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-border md:flex md:flex-col">
      <div className="flex h-14 items-center px-4">
        <span className="font-heading text-sm font-semibold">
          Ordens de Venda
        </span>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-2 py-3">
        <NavLinks />
      </ScrollArea>
    </aside>
  );
}
