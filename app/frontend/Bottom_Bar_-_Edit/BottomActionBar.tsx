/** Edit & Refine bottom bar: Back to Setup · Submit for Review. Asset: 654ba2f3 */
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ROUTES } from "@shared/lib";
import { Button } from "@shared/ui";
import { useDocumentActions } from "./useDocumentActions";

export function BottomActionBar({ documentId, protocolId, status }: { documentId: string; protocolId: string; status?: string }) {
  const { submitForReview, isSubmitting } = useDocumentActions(documentId);
  const navigate = useNavigate();
  const alreadySubmitted = status !== undefined && status !== "Draft";

  return (
    <div className="bottom-bar">
      <Button variant="ghost" icon={<ChevronLeft />} onClick={() => navigate(ROUTES.setup(protocolId))}>
        Back to Setup
      </Button>
      {alreadySubmitted ? (
        <Button iconRight={<ChevronRight />} onClick={() => navigate(ROUTES.review(documentId))}>
          Continue to Review
        </Button>
      ) : (
        <Button iconRight={<ChevronRight />} loading={isSubmitting} disabled={isSubmitting} onClick={() => submitForReview()}>
          Submit for Review
        </Button>
      )}
    </div>
  );
}
