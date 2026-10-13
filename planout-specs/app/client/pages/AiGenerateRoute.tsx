import { GlobalNavigationHeader } from "@app/frontend/Global_Navigation_Header/GlobalNavigationHeader";
import { DocumentGenerationForm } from "@app/frontend/AI_Openrouter_SDK/DocumentGenerationForm";

export function AiGenerateRoute() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <GlobalNavigationHeader />
      <DocumentGenerationForm />
    </div>
  );
}
