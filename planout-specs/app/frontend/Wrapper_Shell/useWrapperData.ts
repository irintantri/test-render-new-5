import { ROUTES } from "@shared/lib";

export function useWrapperData(protocolId?: string | null, icfName?: string | null, icfVersion?: string | null, currentStep = 0) {
  const breadcrumbItems = [
    { label: "Dashboard", link: ROUTES.icfDashboard as string | null },
    { label: "Consent Creation", link: null as string | null },
  ];
  return {
    breadcrumbItems,
    showProtocolPill: protocolId != null && protocolId !== "",
    showIcfName: icfName != null && icfName !== "",
    showIcfVersion: icfVersion != null && icfVersion !== "",
    icfName,
    icfVersion: icfVersion?.replace(/^v/, ""),
    currentStep,
  };
}
