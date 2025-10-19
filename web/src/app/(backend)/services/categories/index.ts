import prisma from "../db";

export async function getAllCategories() {
    try {
        const categories = await prisma.category.findMany();
        return categories;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar categorias.');
    }
}

export async function getCategoryById(id: string) {
    try {
        const category = await prisma.category.findUnique({
            where: {
                id,
            }
        })
        return category;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar categoria');
    }
}

export async function createCategory(data: { name: string }) {
    try {
        const category = await prisma.category.create({
            data: {
                name: data.name,
            }
        })
        return category;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao criar categoria.');
    }
}

export async function updateCategory(data: { id: string, name: string }) {
    try {
        const product = await prisma.product.update({
            where: { id: data.id },
            data: {
                name: data.name,

            }
        })
        return product
    } catch (error) {
        throw new Error( String(error) || 'Falha ao atualizar produto.');
    }
}

export async function deleteCategoryById(id: string) {
    try {
        const category = await prisma.category.delete({
          where: {
            id,
          }  
        })
        return category;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao deletar categoria.');
    }
}