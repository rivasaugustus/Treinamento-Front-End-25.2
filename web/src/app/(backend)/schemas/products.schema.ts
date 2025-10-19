import z from "zod";
import { nameSchema } from "./base.schema";

export const createProductSchema = z.object({
    name: nameSchema,

    desc: z
        .string({
            error: (issue) => issue.input === undefined
                ? "Descrição é obrigatória"
                : "Descrição deve ser um texto"
        })
        .min(1, "Descrição não pode estar vazia")
        .max(100, "Descrição não pode ter mais de 100 caracteres")
        .trim(),

    price: z.number()
}
)