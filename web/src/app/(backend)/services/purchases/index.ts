import { promise } from "zod";
import prisma from "../db";
import { getUsuarioById } from "../usuarios";
import { UserRoundIcon } from "lucide-react";

export async function getAllPurchases() {
    try {
        const purchases = await prisma.purchase.findMany();
        return purchases;

    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar as compras.');
    }
}

export async function getPurchaseById(id: string) {
    try {
        const purchase = await prisma.purchase.findUnique({
            where: {
                id,
            }
        });
        return purchase;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar a compra.');
    }
}

export async function getPurchasesByUserId(id: string) {
    try {
        const purchases = await prisma.purchase.findMany({
            where: {
                user: {
                    id,
                }
            }
        })
        return purchases;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar as compras.')
    }
}

export async function createPurchase(data: { id: string, totalPrice: number }) {
    try {
        const purchase = await prisma.purchase.create({
            data: {
                user: {
                    connect: { id: data.id },
                },
                totalPrice: data.totalPrice,
            }
        })
    } catch (error) {
        throw new Error(String(error) || 'Falha ao criar compra.');
    }
}

export async function deletePurchaseById(id: string) {
    try {
        const product = await prisma.purchase.delete({
            where: {
                id,
            }
        })
        return product;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao deletar compra.');
    }
}