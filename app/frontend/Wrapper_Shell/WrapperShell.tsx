/** Outer chrome for the 5-step creation flow: header, breadcrumb sub-bar, stepper, content, bottom bar. Asset: e368bbe4 */
import { Link } from "react-router-dom";
import { ChevronLeft, FileText } from "lucide-react";
import { Pill } from "@shared/ui";
import { useWrapperData } from "./useWrapperData";
import type { WrapperShellProps } from "./WrapperShell.types";
import "./WrapperShell.css";

export function WrapperShell({ children, protocolId, icfName, icfVersion, currentStep, topBar, stepIndicator, bottomBar, tone = "page" }: WrapperShellProps) {
  const data = useWrapperData(protocolId, icfName, icfVersion, currentStep);
  const [dashboard, current] = data.breadcrumbItems;
  return (
    <div className="shell">
      {topBar}
      <div className="shell__crumbs">
        <Link to={dashboard.link!} className="shell__back">
          <ChevronLeft size={14} />
          {dashboard.label}
        </Link>
        <span className="shell__doc-icon">
          <FileText size={12} />
        </span>
        <span className="shell__current">{current.label}</span>
        {data.showProtocolPill && (
          <>
            <span className="shell__sep" />
            <Pill mono>{protocolId}</Pill>
          </>
        )}
        {(data.showIcfName || data.showIcfVersion) && <span className="shell__sep" />}
        {data.showIcfName && <span className="shell__icf">{data.icfName}</span>}
        {data.showIcfVersion && <Pill strong>v{data.icfVersion}</Pill>}
      </div>
      {stepIndicator}
      <main className={`shell__main shell__main--${tone}`}>{children}</main>
      {bottomBar}
    </div>
  );
}
