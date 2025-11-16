import z from "zod";
import { emailSchema } from "./base.schema";

export const cadastroSchema = z.object({
    email: emailSchema,
    password: z.string().min(8)
})