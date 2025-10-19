import prisma from "../db";

export async function getAllUsers() {
    try {
        const usuarios = await prisma.usuario.findMany();
        return usuarios;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar usuários.');
    }
}

export async function getUsuarioById(id: string) {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id,
            }
        })
        return usuario;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao buscar usuário.');
    }
}

export async function createUsuario(data: { name: string }) {
    try {
        const usuario = await prisma.usuario.create({
            data: {
                name: data.name,
            }
        })
        return usuario;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao criar usuário..');
    }
}

export async function deleteUsuarioById(id: string) {
    try {
        const usuario = await prisma.usuario.delete({
          where: {
            id,
          }  
        })
        return usuario;
    } catch (error) {
        throw new Error(String(error) || 'Falha ao deletar categoria.');
    }
}