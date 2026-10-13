/**
 * Connects Setup form state to the bottom bar:
 * isFormValid = protocol && references.length > 0 && template
 */
import { BottomBarSetup } from "./BottomBarSetup";
import { useGenerateICF } from "./useGenerateICF.hook";

export interface SetupFormState {
  protocol: { protocol_id: string } | null;
  references: { id: string }[];
  template: string | null;
}

export function isFormValid(s: SetupFormState): boolean {
  return Boolean(s.protocol && s.references.length > 0 && s.template);
}

export function SetupBottomBar({ state }: { state: SetupFormState }) {
  const { handleGenerate, isGenerating } = useGenerateICF({
    selectedProtocol: state.protocol?.protocol_id ?? "",
    attachedReferences: state.references.map((r) => r.id),
    selectedTemplate: state.template ?? "",
  });
  return <BottomBarSetup isGenerateEnabled={isFormValid(state)} onGenerate={handleGenerate} isGenerating={isGenerating} />;
}
