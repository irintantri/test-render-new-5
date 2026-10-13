import { z } from "zod";

export const apiResponseSchema = <T extends z.ZodTypeAny>(data: T) => z.object({ data });
export type ApiResponse<T> = { data: T };

export const paginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ items: z.array(item), page: z.number(), pageSize: z.number(), total: z.number() });
export type Paginated<T> = { items: T[]; page: number; pageSize: number; total: number };
