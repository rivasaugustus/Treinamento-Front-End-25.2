import z from "zod";
import { idSchema } from "./base.schema";

export const createPurchaseSchema = z.object({
    id: idSchema,

    totalPrice: z.number()
}
)

export const updatePurchaseSchema = z.object({
    id: idSchema,

    totalPrice: z.number()
}
)