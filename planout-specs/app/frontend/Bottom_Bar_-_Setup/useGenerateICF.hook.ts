import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/lib";
import { useToast } from "@shared/ui";
import { generateICF, type GenerateICFState } from "./icfService";

export function useGenerateICF(state: GenerateICFState) {
  const navigate = useNavigate();
  const notify = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await generateICF(state);
      if (response.status === "SUCCESS") {
        navigate(ROUTES.generate(response.job_id, response.protocol_id));
        return;
      }
      notify("Failed to generate ICF. Please try again.", "error");
    } catch {
      notify("Failed to generate ICF. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate, isGenerating };
}
