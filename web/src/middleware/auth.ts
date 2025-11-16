// app/api/user/route.ts
import { getSession } from "better-auth/server";
import { NextResponse } from "next/server";

export async function authMiddleware(req: Request) {
  const session = await getSession(req);

  if (!session) {
    return NextResponse.json(
        { sucess: false, message: "Usuário não autenticado" }, 
        { status: 401 }
    );
  }

  return NextResponse.next();
}
