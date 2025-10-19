import { NextRequest, NextResponse } from "next/server";
import { createProduct, getAllProducts } from "../../services/products";
import { AllowedRoutes } from "@/types";
import { blockForbiddenRequests, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils";
import { createProductSchema } from "../../schemas/products.schema";
import { toErrorMessage } from "@/utils/api/toErrorMessage";

const allowedRoles: AllowedRoutes = {
    POST: ["SUPER_ADMIN", "ADMIN"]
}

export async function GET() {
    try {
        const products = await getAllProducts();

        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar produtos', error);
        return NextResponse.json(
            { error: 'Falha ao buscar produtos' },
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
        const validationResult = createProductSchema.safeParse(body);

        if (!validationResult.success) {
            return returnInvalidDataErrors(validationResult.error);
        }

        const validatedData = validationResult.data;
        const product = await createProduct(validatedData);

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        if (error instanceof NextResponse) {
            return error;
        }

        if (error instanceof Error) {
            if (error.message.includes('Unique constraint')) {
                if (error.message.includes('name')) {
                    return NextResponse.json(
                        toErrorMessage('Uma produto com esse nome já existe'),
                        { status: 409 }
                    )
                }
                return NextResponse.json(
                    toErrorMessage('Um produto com esses dados já existe'),
                    { status: 409 }
                )
            }

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

