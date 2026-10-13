import type { ReactNode } from "react";

export interface WrapperShellProps {
  protocolId?: string | null;
  icfName?: string | null;
  icfVersion?: string | null;
  /** 0 = Setup … 4 = Preview */
  currentStep: 0 | 1 | 2 | 3 | 4;
  children: ReactNode;
  /** Global application header (TopBar slot) */
  topBar?: ReactNode;
  /** Step indicator slot, rendered with the current step */
  stepIndicator?: ReactNode;
  /** Fixed bottom bar slot */
  bottomBar?: ReactNode;
  /** Main area background ("page" = light grey canvas) */
  tone?: "page" | "white";
}
