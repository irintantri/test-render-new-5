export function Spinner({ size = 20, light = false, label }: { size?: number; light?: boolean; label?: string }) {
  return (
    <span role="status" aria-label={label ?? "Loading"} style={{ display: "inline-flex" }}>
      <span
        className="spinner"
        style={{
          width: size,
          height: size,
          ...(light ? { borderColor: "rgba(255,255,255,0.35)", borderTopColor: "#fff" } : {}),
        }}
      />
    </span>
  );
}

export function FullScreenSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="center-fill full-screen">
      <Spinner size={32} label={label} />
      <span>{label}</span>
    </div>
  );
}

export function PanelSpinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="center-fill">
      <Spinner size={24} label={label} />
      <span>{label}</span>
    </div>
  );
}
