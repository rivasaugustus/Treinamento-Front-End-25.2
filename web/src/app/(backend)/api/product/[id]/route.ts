import { idSchema } from "@/app/(backend)/schemas";
import { createProductSchema, updateProductSchema } from "@/app/(backend)/schemas/products.schema";
import { deleteProduct, getProductById, updateProduct } from "@/app/(backend)/services/products";
import { updatePurchase } from "@/app/(backend)/services/purchases";
import { AllowedRoutes } from "@/types";
import { blockForbiddenRequests, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils";
import { toErrorMessage } from "@/utils/api/toErrorMessage";
import { NextRequest, NextResponse } from "next/server";

const allowedRoles: AllowedRoutes = {
    POST: ["SUPER_ADMIN", "ADMIN"]
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        //Utilizando o esquema de ID pré-definido.
        const validationResult = idSchema.safeParse(id);

        if (!validationResult.success) {
            return NextResponse.json(
                toErrorMessage('ID inválido'),
                { status: 400 }
            )
        }

        const product = await getProductById(id);

        if (!product) {
            return NextResponse.json(
                toErrorMessage('Produto não encontrado.'),
                { status: 404 }
            )
        }
    } catch (error) {
        if (error instanceof NextResponse) {
            return error;
        }
        return zodErrorHandler(error);
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const forbidden = await blockForbiddenRequests(req, allowedRoles.POST);
        const { id } = await params;

        if (forbidden) {
            return forbidden
        }

        const product = await deleteProduct(id);
        return NextResponse.json({ string: "Produto deletado do banco de dados." }, { status: 200 });

    } catch (error) {
        throw new Error(String(error) || 'Falha ao deletar produto.');
    }
}


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string, name: string, desc: string, price: number }>}) {
    try {
    const forbidden = await blockForbiddenRequests(req, allowedRoles.POST);
    const { id, name, desc, price } = await params;

    if (forbidden) {
        return forbidden
    }
    
    const product = await updateProduct({id, name, desc, price});
    return NextResponse.json({ string: "Produto atualizado no banco de dados."}, { status: 200 });
    
    } catch (error) {
        throw new Error(String(error) ||  'Falha ao atualizar produto.');
    }
}
