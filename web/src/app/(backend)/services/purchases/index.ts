import prisma from "../db";
import { sendEmail } from "../send";

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
                id: id
            },
            include: {
                products: true,
                user: true
            }
        });
        return purchase;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar a compra.');
    }
}

export async function getTotalPrice(id: string) {
    const purchase = await prisma.purchase.findUnique({
        where: { id: id },
        include: { products: true },
    });

    if (!purchase) throw new Error("Compra não encontrada");

    const total = purchase.products.reduce((sum, product) => sum + product.price, 0);

    return total;
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

export async function updatePurchase(data: { id: string, totalPrice: number }) {
    try {
        const purchase = await prisma.purchase.update({
            where: { id: data.id },
            data: { totalPrice: data.totalPrice },
        })
        return purchase;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao atualizar compra.');
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

export async function getStatusById(id: string) {
    try {
        const property = await prisma.purchase.findUnique({
            where: { id: id },
            include: {
                status: true
            }
        })

        return property;
    } catch (error) {
        return;
    }
}

export enum Status {
    pending = 'pending',
    paid = 'paid',
    shipped = 'shipped',
    delivered = 'delivered',
    cancelled = 'cancelled'
}

export async function changeStatus(id: string, status: Status) {
    try {
        const purchase = await prisma.purchase.update({
            where: { id: id },
            data: { status: status },
        })

        const compra = await getPurchaseById(id);

        if (compra && compra.user) {
            const userEmail = compra.user.email;
            switch (status) {
                case Status.paid:
                    sendEmail(userEmail, "Pagamento confirmado", status)
                case Status.shipped:
                    sendEmail(userEmail, "Seu pedido foi enviado", status)
                case Status.delivered:
                    sendEmail(userEmail, "Seu pedido foi entregue com sucesso", status)
            }

        }

        return purchase;
    } catch (error) {
        return;
    }
}



