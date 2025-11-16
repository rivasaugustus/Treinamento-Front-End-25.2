import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    const { name, email } = await req.json();

    if (!name || !email) {
        return Response.json({ error: "Dados inválidos"}, { status: 400 });
    }

    if (!validBody(req)) {
        return Response.json({ error: "O body está incorreto."}, { status: 400 });
    }

    return Response.json({ name, email }, { status: 201});
}

function validBody(body: any): boolean {
    if (typeof body.name == 'string' && typeof body.email == 'string') return true;
    return false;    
}