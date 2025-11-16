import { NextRequest, NextResponse } from "next/server";
import { AllowedRoutes } from "@/types";
import { blockForbiddenRequests, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils";
import { toErrorMessage } from "@/utils/api/toErrorMessage";
import { createCategory, getAllCategories } from "../../services/categories";
import { createCategorySchema } from "../../schemas/categories.schema";

const allowedRoles: AllowedRoutes = {
    POST: ["SUPER_ADMIN", "ADMIN"]
}

export async function GET() {
    try {
        const categories = await getAllCategories();

        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar categorias.', error);
        return NextResponse.json(
            { error: 'Falha ao buscar categorias.' },
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const forbidden = await blockForbiddenRequests(req, allowedRoles.POST);

        if (forbidden) {
            return forbidden;
        }

        const body = await validBody(req);
        const validationResult = createCategorySchema.safeParse(body);

        if (!validationResult.success) {
            return returnInvalidDataErrors(validationResult.error);
        }

        const validatedData = validationResult.data;
        const purchase = await createCategory(validatedData);

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
