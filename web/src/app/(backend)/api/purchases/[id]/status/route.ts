import { changeStatus, getStatusById, status } from "@/app/(backend)/services/purchases";
import { zodErrorHandler } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const status = getStatusById(id);

        return status;

    } catch (error) {
            if (error instanceof NextResponse) {
                return error;
            }
            return zodErrorHandler(error);
        }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string, status: status }> }) {
    try {
        const { id, status } = await params;
        const purchase = await changeStatus(id, status);

        return NextResponse.json({ string: "Status atualizado no banco de dados."}, { status: 200 });

    } catch (error) {
            if (error instanceof NextResponse) {
                return error;
            }
            return zodErrorHandler(error);
        }
}