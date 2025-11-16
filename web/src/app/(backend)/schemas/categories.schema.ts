import z from "zod";
import { idSchema, nameSchema } from "./base.schema";

export const createCategorySchema = z.object({
    name: nameSchema,
});


export const updateProductSchema = z.object({
    id: idSchema,
    name: nameSchema,
});