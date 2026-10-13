import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ icon, invalid, className, ...rest }, ref) {
  const input = <input ref={ref} className={["input", invalid && "input--invalid", className].filter(Boolean).join(" ")} aria-invalid={invalid || undefined} {...rest} />;
  return icon ? (
    <div className="input-wrap">
      {icon}
      {input}
    </div>
  ) : (
    input
  );
});

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ invalid, className, ...rest }, ref) {
  return <textarea ref={ref} className={["textarea", invalid && "textarea--invalid", className].filter(Boolean).join(" ")} aria-invalid={invalid || undefined} {...rest} />;
});
