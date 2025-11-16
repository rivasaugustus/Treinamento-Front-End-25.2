import { auth } from "@/auth";
import { betterAuth } from "better-auth";

export const autenticar = betterAuth({
    emailAndPassword: {
        enabled: true
    }
})

const response = await autenticar.api.signInEmail({
    body: {
        email,
        password
    },
    asResponse: true
})