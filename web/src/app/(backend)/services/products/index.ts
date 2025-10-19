import prisma from "../db";

export async function getAllProducts() {
    try {
        const products = await prisma.product.findMany();
        return products;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar produtos.');
    }
}

export async function getProductById(id: string) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                id,
            }
        })
        return product;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar produto.');
    }
}

export async function getProductByName(name: string) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                name,
            }
        })
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar produto.');
    }
}

export async function createProduct(data: { name: string, desc: string, price: number }) {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                desc: data.desc,
                price: data.price
            }
        })
        return product
    } catch (error) {
        throw new Error( String(error) || 'Falha ao criar produto.');
    }
}

export async function updateProduct(data: { id: string, name: string, desc: string, price: number }) {
    try {
        const product = await prisma.product.update({
            where: { id: data.id },
            data: {
                name: data.name,
                desc: data.desc,
                price: data.price
            }
        })
        return product
    } catch (error) {
        throw new Error( String(error) || 'Falha ao atualizar produto.');
    }
}

export async function deleteProduct(id: string) {
    try {
        const product = await prisma.product.delete({
            where: {
                id,
            }
        })
        return product;
    } catch (error) {
        throw new Error ( String(error) || 'Falha ao deletar produto.');
    }
}