import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./Button";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
  headerExtra?: ReactNode;
  bodyStyle?: React.CSSProperties;
}

export function Modal({ open, onClose, title, icon, children, footer, wide, headerExtra, bodyStyle }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={["modal", wide && "modal--wide"].filter(Boolean).join(" ")} role="dialog" aria-modal="true">
        {title !== undefined && (
          <div className="modal__header">
            {icon}
            <span>{title}</span>
            {headerExtra}
            <Button variant="ghost" size="sm" className="modal__close" onClick={onClose} aria-label="Close" icon={<X />} />
          </div>
        )}
        <div className="modal__body" style={bodyStyle}>
          {children}
        </div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
