"use client";

import { Palette, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVariant } from "@/components/providers/VariantProvider";
import { variantList } from "@/config/variants";
import { cn } from "@/lib/utils";

/**
 * Lets the client preview all five aesthetic variants. This is a real product
 * affordance for the brand to choose a direction; it persists to localStorage.
 */
export function VariantSwitcher() {
  const { variant, setVariant } = useVariant();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change design variant"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
      >
        <Palette className="h-[18px] w-[18px]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-64">
        {variantList.map((v) => (
          <DropdownMenuItem
            key={v.id}
            onClick={() => setVariant(v.id)}
            className="cursor-pointer flex-col items-start gap-0.5"
          >
            <span className="flex w-full items-center justify-between font-medium">
              {v.name}
              {v.id === variant && <Check className="h-3.5 w-3.5" />}
            </span>
            <span className="text-xs text-muted-foreground">{v.blurb}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
