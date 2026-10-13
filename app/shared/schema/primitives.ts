import { z, type ZodTypeAny } from "zod";
import { ValidationError } from "../errors";

export const zId = z.string().min(1, "id is required");
export const zTimestamp = z.string().datetime({ offset: true });
export const zNullableTimestamp = zTimestamp.nullable();

export function zEnum<T extends [string, ...string[]]>(values: T) {
  return z.enum(values);
}

/**
 * Build a validate() for a schema. Throws ValidationError naming the failing rule(s).
 */
export function makeValidator<S extends ZodTypeAny>(schema: S, entity: string) {
  return (input: unknown): z.infer<S> => {
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      const rules = parsed.error.issues.map((i) => `${i.path.join(".") || entity}: ${i.message}`);
      throw new ValidationError(`${entity} validation failed — ${rules.join("; ")}`, parsed.error.issues);
    }
    return parsed.data;
  };
}
