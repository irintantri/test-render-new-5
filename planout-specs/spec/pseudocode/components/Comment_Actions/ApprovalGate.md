COMPONENT ApprovalGate:
    STATE reviewers = useFetchReviewers(documentId)
    STATE comments = useFetchComments(documentId)
    
    COMPUTED allCommentsResolved = (countOpen(comments) == 0)
    COMPUTED allReviewersActed = reviewers.every(r => r.hasActed)
    COMPUTED isReadyForApproval = allCommentsResolved AND allReviewersActed

    RENDER:
        // Popover UI
        FOR EACH reviewer IN reviewers:
            DISPLAY reviewer.name, reviewer.role, reviewer.status
            BUTTON "Act" ON CLICK: 
                API.post("/api/reviewers/{reviewer.id}/act")
        
        // Submit Button
        BUTTON SubmitForApprovalButton(
            label: isReadyForApproval ? "Submit for Approval" : "Submit for Approval ({countOpen} open)",
            disabled: !isReadyForApproval,
            onClick: () => API.post("/api/documents/{documentId}/submit-approval")
        )