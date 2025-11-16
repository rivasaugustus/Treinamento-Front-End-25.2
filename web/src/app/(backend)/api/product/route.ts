import { NextRequest, NextResponse } from "next/server";
import { createProduct, getAllProducts } from "../../services/products";
import { AllowedRoutes } from "@/types";
import { blockForbiddenRequests, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils";
import { createProductSchema } from "../../schemas/products.schema";
import { toErrorMessage } from "@/utils/api/toErrorMessage";
import { authMiddleware } from "@/middleware/auth";
import { s3 } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { V } from "vitest/dist/chunks/reporters.d.BFLkQcL6.js";

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
        const middleware = await authMiddleware(req);

        if (middleware) {
            return middleware;
        }

        // --- PEGAR FORM-DATA (necessário para arquivos) ---
        const form = await req.formData();

        // dados comuns
        const name = form.get("name");
        const price = form.get("price");

        // arquivo da imagem
        const file = form.get("image") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "A imagem é obrigatória." },
                { status: 400 }
            );
        }

        // --- VALIDAR BODY (converte formData pra objeto normal) ---
        const body = { name, price };
        const validationResult = createProductSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: "Dados inválidos", details: validationResult.error },
                { status: 400 }
            );
        }

        const validatedData = validationResult.data;

        // --- UPLOAD PARA O S3 ---
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const fileName = `products/${Date.now()}-${file.name}`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: fileName,
                Body: buffer,
                ContentType: file.type,
                ACL: "public-read",
            })
        );

        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;


        const product = await createProduct({
            ...validatedData,
            imageUrl,
        });

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


