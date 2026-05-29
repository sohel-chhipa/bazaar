import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
}

export function Accordion({ items, defaultOpenId }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-card">
      {items.map((item) => {
        const isOpen = openId === item.id;

        return (
          <div key={item.id}>
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => setOpenId((current) => (current === item.id ? null : item.id))}
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium">{item.title}</span>
              <ChevronDown
                className={cn("h-4 w-4 transition", isOpen ? "rotate-180" : "rotate-0")}
              />
            </button>
            {isOpen ? (
              <div className="px-4 pb-4 text-sm text-muted-foreground">{item.content}</div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
