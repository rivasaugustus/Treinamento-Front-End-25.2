import { NextRequest, NextResponse } from "next/server";
import { AllowedRoutes } from "@/types";
import { blockForbiddenRequests, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils";
import { toErrorMessage } from "@/utils/api/toErrorMessage";
import { createPurchase, getAllPurchases } from "../../services/purchases";
import { createPurchaseSchema } from "../../schemas/purchases.schema";
import { authMiddleware } from "@/middleware/auth";

const allowedRoles: AllowedRoutes = {
    POST: ["SUPER_ADMIN", "ADMIN"]
}

export async function GET() {
    try {
        const purchases = await getAllPurchases();

        return NextResponse.json(purchases, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar compras.', error);
        return NextResponse.json(
            { error: 'Falha ao buscar compras.' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const middleware = await authMiddleware(req);

        if (middleware) {
            return middleware;
        }

        const body = await validBody(req);
        const validationResult = createPurchaseSchema.safeParse(body);

        if (!validationResult.success) {
            return returnInvalidDataErrors(validationResult.error);
        }

        const validatedData = validationResult.data;
        const purchase = await createPurchase(validatedData);

        return NextResponse.json(purchase, { status: 201 });
    } catch (error) {
        if (error instanceof NextResponse) {
            return error;
        }

        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                if (error.message.includes('Prisma')) {
                    return NextResponse.json(
                        toErrorMessage('Erro no banco de dados - Verifique os dados fornecidos'),
                        { status: 400 }
                    )
                }
            }

            return zodErrorHandler(error);
        }
    }
}
