import type { FormEvent, FormHTMLAttributes, ReactNode } from "react";

export function Form({ onSubmit, children, ...rest }: Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> & { onSubmit: () => void }) {
  return (
    <form
      noValidate
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        onSubmit();
      }}
      {...rest}
    >
      {children}
    </form>
  );
}

export function Field({ label, htmlFor, error, hint, children }: { label: string; htmlFor?: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="field">
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <span className="field__error" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </div>
  );
}
