import { loginUser } from "@/app/(backend)/services/autenticacao";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
        return Response.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    try {
        const session = await loginUser(email, password);
        return Response.json({ message: "Login realizado com sucesso", session }, { status: 200 });
    } catch (err: any) {
        return Response.json({ error: err.message }, { status: 400 });
    }
}
