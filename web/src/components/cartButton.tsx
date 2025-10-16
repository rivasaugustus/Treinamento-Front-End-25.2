"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { RemoveButton } from "./RemoveButton";
import { useCart } from "@/hooks/use-card";

export function CartButton() {
    const {
        lista
    } = useCart();

    const totalPrice = lista.reduce((acc, item) => acc + item.price, 0);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="cursor-pointer" variant="outline"><ShoppingCart size={50} /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex justify-center">Carrinho</DialogTitle>
                        <ul className="flex-col justify-center">
                            {lista.map((item, i) => (
                                <li key={i} className="flex justify-between m-2">
                                    <span>{item.name}</span>
                                    <RemoveButton puffle={item} />
                                </li>
                            ))}
                            <br></br>
                            <span className="flex justify-center">Total:&nbsp; <span className="font-bold">{totalPrice}</span> &nbsp;coins</span>
                        </ul>
                </DialogHeader>
                <div className="flex items-center gap-2">
                    <div className="grid flex-1 gap-2"></div>
                </div>
                <DialogFooter className="flex justify-center">
                    <DialogClose asChild>
                        <Button className="cursor-pointer " type="button" variant="secondary">
                            Fechar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}