"use client";

import { Puffle } from "@/components/ProdutoCard";
import React, { createContext, useContext, useState } from "react";

interface cardType {
    lista: Puffle[];
    addToCart: (puffle: Puffle) => void;
    removeFromCart: (puffle: Puffle) => void;
}

interface providerProps {
    children: React.ReactNode;
}

const CartContext = createContext<cardType | undefined>(undefined);

export function CartProvider({ children }: providerProps) {
    const [lista, setLista] = useState<Puffle[]>([]);

    function addToCart(puffle: Puffle) {
        setLista((prev: Puffle[]) => [
            ...prev, puffle
        ])

        console.log(puffle.name + " adicionado!");
    }

    function removeFromCart(puffle: Puffle) {
        setLista((prev: Puffle[]) => {
            let found: boolean = false;
            return prev.filter(item => {
                if (!found && item.name === puffle.name) {
                    found = true;
                    return false;
                } else {
                    return true;
                }
            })
        })

        console.log(puffle.name + " adicionado!");
    }

    return (
        <CartContext.Provider value={{
            lista,
            addToCart,
            removeFromCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useUsuario deve ser usado dentro de UsuarioProvider');
    }
    return context;
}