import { GlobalNavigationHeader } from "@app/frontend/Global_Navigation_Header/GlobalNavigationHeader";
import { ICFDashboard } from "@app/frontend/02_-_ICF_Dashboard/ICFDashboard";

export function IcfDashboardPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      <GlobalNavigationHeader />
      <ICFDashboard />
    </div>
  );
}
