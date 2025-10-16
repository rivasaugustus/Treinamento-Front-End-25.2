import { NextRequest } from "next/server";

export default async function GET (req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const a = searchParams.get('a');
    const b = searchParams.get('b');
    
    if (typeof a === 'number' && typeof b === 'number') {
        Response.json({ sum: a+b }, { status: 200});
    }
}