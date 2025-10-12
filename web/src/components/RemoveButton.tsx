"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-card";
import { ArrowDownIcon } from "lucide-react";
import { Puffle } from "./ProdutoCard";

interface RemoveButtonProps {
  puffle: Puffle
}

export function RemoveButton({puffle}: RemoveButtonProps) {
  const {
    removeFromCart
  } = useCart();

  return (
    <div className="flex flex-col gap-8">
      <Button variant="outline" size="icon" className="rounded-full size-4 ml-2 mr-1 bg-red-400 cursor-pointer" onClick={() => removeFromCart(puffle)}>
        <ArrowDownIcon />
      </Button>
    </div>
  )
}