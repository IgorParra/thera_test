"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";

export function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-2 border-b border-border px-4 md:px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={<Button variant="ghost" size="icon" className="md:hidden" />}
        >
          <Menu />
          <span className="sr-only">Abrir menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Ordens de Venda</SheetTitle>
          </SheetHeader>
          <div className="px-2">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <span className="font-heading text-sm font-semibold md:hidden">
        Ordens de Venda
      </span>
    </header>
  );
}
