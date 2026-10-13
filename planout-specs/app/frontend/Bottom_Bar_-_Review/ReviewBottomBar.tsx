/** Review page bottom bar: Back to Edit · Submit for Approval (N open). Asset: 51f28719 */
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Send, Eye } from "lucide-react";
import { ROUTES } from "@shared/lib";
import { Button } from "@shared/ui";
import { getSubmitButtonLabel } from "@app/controller/Bottom_Bar_-_Review/ReviewBottomBarLogic";
import { useDocumentSubmission } from "./useDocumentSubmission";

export function ReviewBottomBar({ documentId, openCommentsCount, status, extra }: { documentId: string; openCommentsCount: number; status?: string; extra?: ReactNode }) {
  const { submitForApproval, isSubmitting } = useDocumentSubmission(documentId);
  const navigate = useNavigate();
  const submitButtonLabel = getSubmitButtonLabel(openCommentsCount);

  return (
    <div className="bottom-bar bottom-bar-review">
      <Button variant="ghost" icon={<ChevronLeft />} onClick={() => navigate(ROUTES.edit(documentId))}>
        Back to Edit
      </Button>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {extra}
        {status === "Approved" ? (
          <Button icon={<Eye />} onClick={() => navigate(ROUTES.preview(documentId))}>
            Go to Preview
          </Button>
        ) : (
          <Button icon={<Send />} disabled={isSubmitting} loading={isSubmitting} onClick={() => submitForApproval()}>
            {submitButtonLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
