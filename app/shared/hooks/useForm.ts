import { useState } from "react";

export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Form state with on-change validation.
 * validate(values) returns a map of field → message for every failing rule.
 */
export function useForm<T extends Record<string, unknown>>(initial: T, validate: (values: T) => FormErrors<T>) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(next));
  };

  /** Validate everything; returns true when valid. */
  const validateAll = () => {
    const errs = validate(values);
    setErrors(errs);
    setTouched(Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
    return Object.keys(errs).length === 0;
  };

  const visibleError = (key: keyof T) => (touched[key] ? errors[key] : undefined);

  return { values, errors, setField, validateAll, visibleError, reset: () => (setValues(initial), setErrors({}), setTouched({})) };
}
