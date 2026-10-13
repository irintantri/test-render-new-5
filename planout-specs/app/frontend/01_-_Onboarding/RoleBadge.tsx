import { FileText, PenLine, ShieldCheck, UserRound } from "lucide-react";

const ROLE_ICON: Record<string, typeof PenLine> = {
  "ICF Author": PenLine,
  "Medical Writer": FileText,
  Reviewer: ShieldCheck,
};

const slug = (role: string) => role.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/** Colour-coded role chip; styling keyed by "badge-<role>". */
export function RoleBadge({ roleName }: { roleName: string }) {
  const Icon = ROLE_ICON[roleName] ?? UserRound;
  return (
    <span className={`role-badge badge-${slug(roleName)}`}>
      <Icon size={12} />
      {roleName}
    </span>
  );
}
