import { getTotalPrice } from "@/app/(backend)/services/purchases";
import { zodErrorHandler } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { id } from "zod/v4/locales";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const totalPrice = getTotalPrice(id);

        return totalPrice;
    } catch (error) {
            if (error instanceof NextResponse) {
                return error;
            }
            return zodErrorHandler(error);
        }
}