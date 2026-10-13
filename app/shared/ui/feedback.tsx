import { Component, createContext, useCallback, useContext, useState, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, FileQuestion, Info, X } from "lucide-react";
import { Button } from "./Button";

/* ---------- EmptyState ---------- */
export function EmptyState({ title, description, icon, action }: { title: string; description?: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      <div className="empty__icon">{icon ?? <FileQuestion size={20} />}</div>
      <div className="empty__title">{title}</div>
      {description && <div>{description}</div>}
      {action}
    </div>
  );
}

/* ---------- Banner ---------- */
export function ErrorBanner({ message, onDismiss }: { message: string | null | undefined; onDismiss?: () => void }) {
  if (!message) return null;
  return (
    <div className="banner banner--error" role="alert">
      <AlertCircle />
      <span>{message}</span>
      {onDismiss && (
        <button className="banner__close" onClick={onDismiss} aria-label="Dismiss">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export function InfoNote({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", color: "var(--muted)", fontSize: 12 }}>
      <Info size={14} color="var(--primary)" />
      <span>{children}</span>
    </div>
  );
}

/* ---------- ErrorBoundary ---------- */
export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("UI error", error, info.componentStack);
  }
  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <EmptyState
            title="Something went wrong"
            description={this.state.error.message}
            icon={<AlertCircle size={20} color="var(--red-600)" />}
            action={
              <Button variant="outline" onClick={() => this.setState({ error: null })}>
                Try again
              </Button>
            }
          />
        )
      );
    }
    return this.props.children;
  }
}

/* ---------- Toasts ---------- */
type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}
const ToastCtx = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const notify = useCallback((message: string, kind: ToastKind = "info") => {
    const id = Date.now() + Math.random();
    setItems((xs) => [...xs, { id, kind, message }]);
    setTimeout(() => setItems((xs) => xs.filter((t) => t.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={notify}>
      {children}
      <div className="toasts" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast toast--${t.kind}`}>
            {t.kind === "success" ? <CheckCircle2 /> : t.kind === "error" ? <AlertCircle /> : <Info />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
