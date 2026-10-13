/** Composes the creation-flow chrome: WrapperShell + GlobalNavigationHeader + ProgressStepper. */
import type { ReactNode } from "react";
import { WrapperShell } from "@app/frontend/Wrapper_Shell/WrapperShell";
import type { WrapperShellProps } from "@app/frontend/Wrapper_Shell/WrapperShell.types";
import { GlobalNavigationHeader } from "@app/frontend/Global_Navigation_Header/GlobalNavigationHeader";
import { ProgressStepper } from "@app/frontend/Progress_Stepper/ProgressStepper";

export function CreationLayout({
  currentStep,
  documentId,
  protocolId,
  icfName,
  icfVersion,
  tone,
  bottomBar,
  children,
}: {
  currentStep: WrapperShellProps["currentStep"];
  documentId?: string | null;
  protocolId?: string | null;
  icfName?: string | null;
  icfVersion?: string | null;
  tone?: WrapperShellProps["tone"];
  bottomBar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <WrapperShell
      currentStep={currentStep}
      protocolId={protocolId}
      icfName={icfName}
      icfVersion={icfVersion}
      tone={tone}
      topBar={<GlobalNavigationHeader />}
      stepIndicator={<ProgressStepper currentStep={currentStep} documentId={documentId} protocolId={protocolId} />}
      bottomBar={bottomBar}
    >
      {children}
    </WrapperShell>
  );
}
