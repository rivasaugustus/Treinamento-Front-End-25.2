import { registerUser } from "@/app/(backend)/services/autenticacao";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
        return Response.json({ error: "Todos os campos são obrigatórios" })
    }

    try {
        const user = await registerUser(email, password, name);
        return Response.json({ message: "Usuário registrado com sucesso", user }, { status: 201 });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400});
    }
}