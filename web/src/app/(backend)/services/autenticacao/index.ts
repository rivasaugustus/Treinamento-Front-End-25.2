import { auth } from "@/auth";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export const autenticar = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mongodb",
    }),
    emailAndPassword: {
        enabled: true,
        password: {
          hash: async (password: string) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
          },

          verify: async ({ hash, password }) => {
            const isCorrectPassword = await bcrypt.compare(password, hash);
            return isCorrectPassword;
          }
        }
    }
})

export async function registerUser(email: string, password: string, name: string) {
    const result = await autenticar.api.signUpEmail({
        body: { email, password, name },
    });
    return result;    
}

export async function loginUser(email: string, password: string) {
  const result = await autenticar.api.signInEmail({
    body: { email, password },
  });
  return result;
}

  export async function logoutUser(req: NextRequest ) {
  const result = await autenticar.api.signOut({ headers: req.headers});
  return result;
}