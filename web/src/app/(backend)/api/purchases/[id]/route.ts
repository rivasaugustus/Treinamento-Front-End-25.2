import { idSchema } from "@/app/(backend)/schemas";
import { deletePurchaseById, getPurchaseById, updatePurchase } from "@/app/(backend)/services/purchases";
import { AllowedRoutes } from "@/types";
import { blockForbiddenRequests, zodErrorHandler } from "@/utils";
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

        const purchase = await getPurchaseById(id);

        if (!purchase) {
            return NextResponse.json(
                toErrorMessage('Compra não encontrada.'),
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string, totalPrice: number }>}) {
    try {
    const forbidden = await blockForbiddenRequests(req, allowedRoles.POST);
    const { id, totalPrice } = await params;

    if (forbidden) {
        return forbidden
    }
    
    const product = await updatePurchase({id, totalPrice});
    return NextResponse.json({ string: "Compra atualizada no banco de dados."}, { status: 200 });
    
    } catch (error) {
        throw new Error(String(error) ||  'Falha ao atualizar compra.');
    }
}



export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
    try {
    const forbidden = await blockForbiddenRequests(req, allowedRoles.POST);
    const { id } = await params;

    if (forbidden) {
        return forbidden
    }
    
    const product = await deletePurchaseById(id);
    return NextResponse.json({ string: "Compra deletada do banco de dados."}, { status: 200 });
    
    } catch (error) {
        throw new Error(String(error) ||  'Falha ao deletar compra.');
    }
}