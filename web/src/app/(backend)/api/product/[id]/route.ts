import { idSchema } from "@/app/(backend)/schemas";
import { createProductSchema, updateProductSchema } from "@/app/(backend)/schemas/products.schema";
import prisma from "@/app/(backend)/services/db";
import { deleteProduct, getProductById, updateProduct } from "@/app/(backend)/services/products";
import { updatePurchase } from "@/app/(backend)/services/purchases";
import { s3 } from "@/lib/s3";
import { authMiddleware } from "@/middleware/auth";
import { AllowedRoutes } from "@/types";
import { blockForbiddenRequests, returnInvalidDataErrors, validBody, zodErrorHandler } from "@/utils";
import { toErrorMessage } from "@/utils/api/toErrorMessage";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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

        return product;
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


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const middleware = await authMiddleware(req);
        if (middleware) return middleware;

        const { id } = await params;

        const existingProduct = await prisma.product.findUnique({ where: { id } });

        if (!existingProduct) {
            return NextResponse.json(
                { error: "Produto não encontrado." },
                { status: 404 }
            );
        }

        const form = await req.formData();
        const name = (form.get("name") as string) ?? existingProduct.name;
        const desc = (form.get("desc") as string) ?? existingProduct.desc;
        const price = form.get("price")
            ? Number(form.get("price"))
            : existingProduct.price;

        const file = form.get("image") as File | null;

        let imageUrl = existingProduct.imageURL;

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const key = `products/${Date.now()}-${file.name}`;

            await s3.send(
                new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME!,
                    Key: key,
                    Body: buffer,
                    ContentType: file.type,
                    ACL: "public-read",
                })
            );

            imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        }

        const product = await updateProduct({
            id,
            name,
            desc,
            price,
            imageUrl,
        });
        return NextResponse.json({ string: "Produto atualizado no banco de dados." }, { status: 200 });
    } catch (error) {
        throw new Error(String(error) || 'Falha ao atualizar produto.');
    }
}
