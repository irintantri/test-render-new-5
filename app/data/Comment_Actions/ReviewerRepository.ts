/** Persistence for Reviewer status updates. */
import { makeValidator, zReviewerEntity, type ReviewerEntity } from "@shared/schema";
import { repos } from "@shared/db";

export const reviewerSchema = zReviewerEntity;
export type Reviewer = ReviewerEntity;
export const validate = makeValidator(reviewerSchema, "Reviewer");

export function fetchReviewersByDocument(documentId: string): Reviewer[] {
  return repos.reviewers.findMany({ document_id: documentId });
}

/** SET acted = TRUE */
export function updateReviewerStatus(reviewerId: string): Reviewer {
  return validate(repos.reviewers.update(reviewerId, { acted: true }));
}
